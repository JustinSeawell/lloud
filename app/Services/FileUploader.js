"use strict";

const Service = use("App/Services");
const Drive = use("Drive");

const AudioFile = use("App/Models/AudioFile");
const ImageFile = use("App/Models/ImageFile");

class FileUploader extends Service {
  doThrow(msg) {
    throw new Error(`File Upload Failed: ${msg}`);
  }

  cleanupFileName(fileName) {
    return fileName.trim().replace(/\s+/g, "-");
  }

  addTimestampToFileName(fileName) {
    let timestamp = new Date().getTime();
    return timestamp + "-" + fileName;
  }

  async uploadAudioFileToS3(fileObj) {
    try {
      const fileName = this.addTimestampToFileName(
        this.cleanupFileName(fileObj.clientName)
      );

      await Drive.disk("lloud_audio").put(
        fileName,
        await Drive.get(fileObj.tmpPath)
      );
      await Drive.delete(fileObj.tmpPath);

      const newUrl = Drive.disk("lloud_audio").getUrl(fileName);

      const audioFile = await AudioFile.create({
        name: fileName,
        location: newUrl,
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
        this.cleanupFileName(fileObj.clientName)
      );

      await Drive.disk("lloud_images").put(
        fileName,
        await Drive.get(fileObj.tmpPath)
      );
      await Drive.delete(fileObj.tmpPath);

      const newUrl = Drive.disk("lloud_images").getUrl(fileName);

      const imageFile = await ImageFile.create({
        name: fileName,
        location: newUrl,
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
