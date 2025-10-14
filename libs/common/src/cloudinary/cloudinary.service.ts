import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
const streamifier = require('streamifier');
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import 'multer';
import { AvatarRepository } from './../repository/Avatar.repository';
import path from 'path';

@Injectable()
export class CloudinaryService {
  constructor(private avatarRepository: AvatarRepository) {}

  async uploadFileAvatarUser(
    userId: number,
    // fileBuffer: Buffer,
    file: Express.Multer.File,
    originalName?: string,
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException({
        message: 'Invalid image file',
        name: 'Error',
        http_code: 400,
      });
    }
    try {
      const avatar = await this.avatarRepository.findUnique(userId);

      if (!avatar) {
        throw new NotFoundException('Avatar not found');
      }
      if (avatar) {
        await this.deleteImage(avatar.publicId);
        await this.avatarRepository.delete(avatar.id);
      }

      const mainFolder = 'microServiceNestjs';
      const fileName = path.parse(originalName).name;
      const uniqueFileName = `${fileName}_${Date.now()}`;
      const filePathOnCloudinary = `${mainFolder}/${uniqueFileName};`;

      const imageC = await new Promise<{ url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: filePathOnCloudinary,
            resource_type: 'image',
            fetch_format: 'auto',
            quality: 'auto:eco',
            crop: 'limit',
          },
          (
            err: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (err) {
              console.error(`Cloudinary:  ${err}`);
              reject(err);
            } else if (result && result.secure_url) {
              resolve({ url: result.secure_url });
            } else {
              reject(
                new Error('Failed to get secure_url from Cloudinary response'),
              );
            }
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
      const newAvatar = await this.avatarRepository.create({
        data: {
          url: imageC.url,
          publicId: filePathOnCloudinary,
          userId: userId,
        },
      });
      return { avatar: newAvatar.id };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error(`Error in uploadToCloudinary::  ${error}`);
    }
  }

  async uploadFromUrl(
    imageUrl: string,
    publicId: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageUrl,
        {
          public_id: publicId,
          resource_type: 'image',
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result?.secure_url) {
            return reject(new Error('Upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
    });
  }

  async getImageAvatar(avatarId: number) {
    const res = await this.avatarRepository.findUnique(avatarId);
    if (!res) {
      throw new NotFoundException('Not found image');
    }
    return res;
  }
  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
