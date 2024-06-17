import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import toStream from 'buffer-to-stream';
import fs from 'fs';
import util from 'util';

const writeFileAsync = util.promisify(fs.writeFile);
@Injectable()
export class StorageService {
  static async getCloudinaryStorage() {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
      } as any,
    });
  }
  constructor(private readonly configService: ConfigService) {}
  private containerName: string;

  private async getBlobServiceInstance() {
    const connectionString = this.configService.get('storage.uri');
    const blobClientService = await BlobServiceClient.fromConnectionString(
      connectionString,
    );
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerName = this.containerName;
    const containerClient = blobService.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  public async uploadFile(file: Express.Multer.File, containerName: string) {
    this.containerName = containerName;
    const extension = file.originalname.split('.').pop();
    const file_name = v4() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }

  // public async saveToLocalDirectory(
  //   file: Express.Multer.File,
  //   destinationDirectory: string,
  // ): Promise<string> {
  //   // Ensure the destination directory exists
  //   if (!fs.existsSync(destinationDirectory)) {
  //     fs.mkdirSync(destinationDirectory, { recursive: true });
  //   }

  //   const extension = path.extname(file.originalname);
  //   const fileName = `${v4()}${extension}`;
  //   const filePath = path.join(destinationDirectory, fileName);

  //   // If using diskStorage, the file is already on disk, so just return the file path
  //   if (file.path) {
  //     // Rename the file to the desired file name
  //     fs.renameSync(file.path, filePath);
  //     return filePath;
  //   } else {
  //     throw new Error(
  //       'File path is not available in the provided file object.',
  //     );
  //   }
  // }

  public async deleteFile(file_name: string, containerName: string) {
    try {
      this.containerName = containerName;
      const blockBlobClient = await this.getBlobClient(file_name);
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      
    }
  }

  public async uploadMultipleToCloudinary(files) {
    try {
      if (!files || files.length === 0) return;

      const promises = files.map((file: any) => {
        return new Promise((resolve, reject) => {
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });

          const upload = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result);
          });

          toStream(file.buffer).pipe(upload);
        });
      });

      return Promise.all(promises);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  public async uploadToCloudinary(file: Express.Multer.File) {
    try {
      if (!file) return;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

        toStream(file.buffer).pipe(upload);
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  public async uploadQrToCloudinary(qrCodeContent: string): Promise<any> {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // Convert QR code content to a temporary file
      const tempFilePath = 'temp_qr_code.png';
      await writeFileAsync(tempFilePath, qrCodeContent);

      // Read the temporary file into a buffer
      const buffer = fs.readFileSync(tempFilePath);

      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream((error, result) => {
          // Cleanup: Delete the temporary file
          fs.unlinkSync(tempFilePath);

          if (error) return reject(error);
          resolve(result);
        });

        toStream(buffer).pipe(upload);
      });
    } catch (error) {
      console.error('Error uploading QR code to Cloudinary:', error);
      throw error;
    }
  }
}
