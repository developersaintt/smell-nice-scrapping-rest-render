// @desc    Gets All Products
// @route   GET /api/products

const puppeteer = require("puppeteer");
// const chromium = require("chrome-aws-lambda");
// const puppeteer = require("puppeteer-core");

async function scrapURL(req, res) {
  try {
    const urlParam = req.query?.url;

    if (!urlParam) {
      //   res.writeHead(200, { "Content-Type": "application/json" });
      res.send({ error: "url is required" });
      return;
    }

    if (!urlParam.includes("fragrantica.com")) {
      //   res.writeHead(200, { "Content-Type": "application/json" });
      res.send({ error: "only accepts fragrantic urls" });
      return;
    }

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.goto(
        urlParam,
        // "https://www.fragrantica.com/perfume/Francesca-Bianchi/Sex-And-The-Sea-Neroli-54515.html",
        // "https://www.fragrantica.com/perfume/New-York-Yankees/New-York-Yankees-14600.html",
        { waitUntil: "domcontentloaded" }
      );

      // Accords
      const accordBoxData = await page.$$eval(".accord-box", (elements) =>
        elements.map((el) => ({
          [el.textContent.trim()]: (
            parseFloat(el.querySelector(".accord-bar").style.width) / 10
          ).toFixed(2),
        }))
      );

      // Seasons
      await page.waitForSelector("#rating + div + div > div + div [index]");
      const seasons = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("#rating + div + div > div + div [index]")
        ).map((itm) => {
          return {
            [itm.innerText]: (
              parseFloat(
                itm.querySelector(".voting-small-chart-size div div").style
                  .width
              ) / 10
            ).toFixed(2),
          };
        });
      });

      // Notes
      await page.waitForSelector("#pyramid");
      const notes = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll("#pyramid h4"));
        if (headings.length === 0) {
          let notesWrapper = document
            .querySelector(".notes-box")
            .nextElementSibling.querySelector("div").children;

          return {
            "Base Notes": Array.from(notesWrapper).map((node) => {
              return {
                text: node.textContent.trim(),
                img: node.querySelector("img").src,
              };
            }),
          };
        }
        const extractNotes = (headingText) => {
          const headingNode = headings.find((node) =>
            node.textContent.includes(headingText)
          );
          if (!headingNode) return [];
          let notesWrapper =
            headingNode.nextElementSibling.querySelector("div").children;

          return {
            [headingText]: Array.from(notesWrapper).map((node) => {
              return {
                text: node.textContent.trim(),
                img: node.querySelector("img").src,
              };
            }),
          };
        };
        const topNotes = extractNotes("Top Notes");
        const middleNotes = extractNotes("Middle Notes");
        const baseNotes = extractNotes("Base Notes");
        return {
          ...topNotes,
          ...middleNotes,
          ...baseNotes,
        };
      });

      // Description

      await page.waitForSelector("[itemprop='description']");
      const description = await page.evaluate(() => {
        document
          .querySelector("[itemprop='description']")
          .querySelector(".reviewstrigger").innerHTML = "";
        return document.querySelector("[itemprop='description']").textContent;
      });

      await browser.close();

      //   res.writeHead(200, { "Content-Type": "application/json" });
      res.send({
        notes,
        seasons: {
          ...seasons.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
        },
        description,
        accordBoxData: {
          ...accordBoxData.reduce((acc, obj) => ({ ...acc, ...obj }), {}),
        },
      });
    } catch (error) {
      console.log(error);
      if (browser) await browser.close();
      //   res.writeHead(200, { "Content-Type": "application/json" });
      res.send(JSON.stringify(error));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  scrapURL,
};
