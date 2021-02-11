"use strict";

const Service = use("App/Services");
const Drive = use("Drive");

const AudioFile = use("App/Models/AudioFile");
const ImageFile = use("App/Models/ImageFile");

class FileUploader extends Service {
  doThrow(msg) {
    throw new Error(`File Upload Failed: ${msg}`);
  }

  // Thanks Bae :)
  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, "");

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    // Remove invalid chars
    str = str
      .replace(/[^a-z0-9 -]/g, "")
      // Collapse whitespace and replace by -
      .replace(/\s+/g, "-")
      // Collapse dashes
      .replace(/-+/g, "-");

    return str;
  }

  cleanupFileName(fileObj) {
    const ext = fileObj.extname;
    const ogName = fileObj.clientName;
    const plainName = ogName.replace(ext, "");
    const slugifiedName = this.slugify(plainName);
    return slugifiedName + "." + ext;
  }

  addTimestampToFileName(fileName) {
    let timestamp = new Date().getTime();
    return timestamp + "-" + fileName;
  }

  processFileName(fileObj) {
    return this.addTimestampToFileName(this.cleanupFileName(fileObj));
  }

  async uploadAudioFileToS3(fileObj) {
    try {
      const fileName = this.addTimestampToFileName(
        this.cleanupFileName(fileObj)
      );

      await Drive.disk("lloud_audio").put(
        fileName,
        await Drive.get(fileObj.tmpPath),
        {
          ContentType: `audio/${fileObj.extname == "wav" ? "x-wav" : "mpeg"}`,
        }
      );
      await Drive.delete(fileObj.tmpPath);

      const location = "https://audio.lloudapp.com/" + fileName;

      const audioFile = await AudioFile.create({
        name: fileName,
        location: location,
        s3_bucket: "lloud_audio",
      });

      return audioFile;
    } catch (err) {
      this.doThrow(err.message);
    }
  }

  async uploadImageFileToS3(fileObj) {
    try {
      const fileName = this.addTimestampToFileName(
        this.cleanupFileName(fileObj)
      );

      await Drive.disk("lloud_images").put(
        fileName,
        await Drive.get(fileObj.tmpPath),
        {
          ContentType: `image/${
            fileObj.extname == "png" || fileObj.extname == "PNG"
              ? "png"
              : "jpeg"
          }`,
        }
      );
      await Drive.delete(fileObj.tmpPath);

      // const location = "https://images.lloudapp.com/" + fileName;
      const location = "https://ik.imagekit.io/mvp1bbxuku/" + fileName;

      const imageFile = await ImageFile.create({
        name: fileName,
        location: location,
        s3_bucket: "lloud_images",
      });

      return imageFile;
    } catch (err) {
      this.doThrow(err.message);
    }
  }

  static create() {
    return new FileUploader();
  }
}

module.exports = FileUploader;
