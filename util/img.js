const path = require("path");
const sharp = require("sharp");

const resizeNearestOpts = {
  kernel: sharp.kernel.nearest,
  fit: "contain",
  position: "right top",
  background: { r: 0, g: 0, b: 0, alpha: 0 },
};

module.exports = {
  gm: async function gm({ name, width = 1024, height = 512 }) {
    try {
      const gm = await sharp(path.resolve("./punks", "assets/gm.png"))
        .png()
        .toBuffer();
      const punk = await sharp(
        path.resolve("./punks", `transparent/${name}.png`)
      )
        .resize(24, 24, resizeNearestOpts)
        .png()
        .toBuffer();
      await sharp({
        create: {
          width: 48,
          height: 24,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
        .composite([
          { input: gm, gravity: "east" },
          { input: punk, gravity: "west" },
        ])
        .png()
        .toBuffer()
        .then((data) =>
          sharp(data)
            .resize(width, height, resizeNearestOpts)
            .png()
            .toFile(path.resolve("./punks", `${name}-gm.png`))
        );

      return `./punks/${name}-gm.png`;
    } catch (error) {
      console.log(error);
    }
  },
  say: async function say({ name, phrase, width = 1080, height = 432 }) {
    try {
      // Calculate text position and size based on 1:1 pixel size, where the total image is 60x24
      const textHeight = height * (12 / 24);
      const textWidth = width * (25 / 60) + 10; // The extra space tends to render text more inside the bounds we want
      const textPadding = {
        top: height * (5 / 24),
        right: width * (6 / 60),
        bottom: height * (7 / 24),
        left: width * (29 / 60),
      };
      const text = {
        text: {
          text: phrase,
          width: textWidth,
          height: textHeight,
          align: "center",
          font: "Alagard",
          fontfile: path.resolve("./punks", "assets/alagard.ttf"),
          rgba: true,
        },
      };
      let textOverlay = await sharp(text).png().toBuffer();
      const bubblePath = path.resolve("./punks", "assets/say.png");
      const bubble = await sharp(bubblePath)
        .resize(width, height, resizeNearestOpts)
        .png()
        .toBuffer();
      const punk = await sharp(
        path.resolve("./punks", `transparent/${name}.png`)
      )
        .resize(height, height, resizeNearestOpts)
        .png()
        .toBuffer();
      await sharp({
        create: {
          width: width,
          height: height,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 },
        },
      })
        .composite([
          {
            input: punk,
            gravity: "west",
          },
          { input: bubble, gravity: "east" },
          {
            input: textOverlay,
            top: textPadding.top,
            right: textPadding.right,
            bottom: textPadding.bottom,
            left: textPadding.left,
          },
        ])
        .png()
        .toBuffer()
        .then((data) =>
          sharp(data)
            .png()
            .toFile(path.resolve("./punks", `${name}-say.png`))
        );
      return path.resolve("./punks", `${name}-say.png`);
    } catch (error) {
      console.log(error);
    }
  },
};
