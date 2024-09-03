'use server'

import fs from 'fs';
import path from 'path';


export async function renameImage(oldFile, newFile) {
  try {
    const oldFilePath = path.join(process.cwd(), 'public', 'Game Images', oldFile + '.png');
    const newFilePath = path.join(process.cwd(), 'public', 'Game Images', newFile + '.png');
    fs.renameSync(oldFilePath, newFilePath);
  } catch (error) {
    console.error(error);
  }
}

export async function deleteImage(file) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'Game Images', file + '.png');
    fs.unlinkSync(filePath)
  } catch (error) {
    console.error(error);
  }
}

export async function createImage(dataURL, name) {
  try {
    const newFilePath = path.join(process.cwd(), 'public', 'Game Images', name + '.png');
    const base64Data = dataURL.split(';base64,').pop();
    fs.writeFileSync(newFilePath, base64Data, { encoding: 'base64' });
  } catch (error) {
    console.error(error);
  }
}
