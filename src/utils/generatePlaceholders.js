import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const videosDir = path.join(__dirname, '../../public/videos');
const placeholdersDir = path.join(__dirname, '../../public/placeholders');

// Ensure the placeholders directory exists
if (!fs.existsSync(placeholdersDir)) {
	fs.mkdirSync(placeholdersDir);
}

// Function to generate a placeholder image for a video
const generatePlaceholder = (videoPath, outputPath) => {
	return new Promise((resolve, reject) => {
		const command = `ffmpeg -i "${videoPath}" -vf "thumbnail,scale=iw/2:ih/2" -frames:v 1 "${outputPath}"`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error generating placeholder: ${stderr}`);
			} else {
				resolve(outputPath);
			}
		});
	});
};

// Function to apply grayscale filter to an image and save as JPEG
const applyGrayscale = async (imagePath) => {
	const image = await loadImage(imagePath);
	const canvas = createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0);
	ctx.globalCompositeOperation = 'saturation';
	ctx.fillStyle = 'hsl(0, 0%, 50%)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const outputPath = imagePath.replace('.png', '_grayscale.jpg');
	const out = fs.createWriteStream(outputPath);
	const stream = canvas.createJPEGStream({ quality: 0.5 });
	stream.pipe(out);
	out.on('finish', () => console.log(`Grayscale image saved to ${outputPath}`));
};

// Process each video in the directory
fs.readdir(videosDir, (err, files) => {
	if (err) {
		console.error('Error reading videos directory:', err);
		return;
	}

	files.forEach(async (file) => {
		const videoPath = path.join(videosDir, file);
		const placeholderPath = path.join(placeholdersDir, `${path.parse(file).name}.png`);
		const grayscalePlaceholderPath = placeholderPath.replace('.png', '_grayscale.jpg');

		// Check if the grayscale placeholder already exists
		if (fs.existsSync(grayscalePlaceholderPath)) {
			console.log(`Grayscale placeholder already exists for ${file}`);
			return;
		}

		try {
			await generatePlaceholder(videoPath, placeholderPath);
			await applyGrayscale(placeholderPath);
			// Optionally, remove the original placeholder if only grayscale is needed
			fs.unlinkSync(placeholderPath);
		} catch (error) {
			console.error(error);
		}
	});
});
