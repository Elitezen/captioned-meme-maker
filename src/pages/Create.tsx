import { ChangeEvent, useEffect, useState, useRef } from "react";
import '../App.scss';
import './Create.module.scss';
import { Link } from "react-router-dom";

export default function Create() {
	const STARTING_TEXT_VALUE = 'Enter Text';
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [textInput, setTextInput] = useState<string>(STARTING_TEXT_VALUE);
	const [resultImageURL, setResultImageURL] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			setSelectedFile(files[0]);
		}
	};

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newTextValue = event.target.value;
		setTextInput(newTextValue.length ? newTextValue.trim() : STARTING_TEXT_VALUE);
	};

	useEffect(() => {
		if (selectedFile === null) return;

		const img = new Image();
		img.src = URL.createObjectURL(selectedFile);

		img.onload = () => {
			// Calculate the new dimensions with the white border
			const newWidth = img.width;
			const newHeight = img.height + (img.height * 0.2); // 20% of image height

			// Create a canvas element
			const canvas = canvasRef.current;
			if (!canvas) return;

			canvas.width = newWidth;
			canvas.height = newHeight;

			// Get 2D context
			const ctx = canvas.getContext('2d')!;

			// Draw the image on the canvas
			ctx.drawImage(img, 0, newHeight - img.height, img.width, img.height);

			// Draw the white border on top
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, newWidth, newHeight - img.height);

			// Center the text horizontally and vertically
			ctx.fillStyle = 'black'; // Set text color
			ctx.font = `${img.width * 0.05}px Impact`; // Set font style and size
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';

			// Function to wrap and center the text vertically
			const wrapAndCenterText = (
				context: CanvasRenderingContext2D,
				text: string,
				x: number,
				y: number,
				maxWidth: number,
				maxHeight: number
			  ) => {
				const words = text.split(' ');
				let line = '';
				let lines: string[] = [];
			  
				// Function to calculate the width of the text at a specific font size
				const getTextWidth = (fontSize: number) => {
				  context.font = `${fontSize}px Impact`;
				  return context.measureText(line).width;
				};
			  
				// Function to calculate the maximum font size that fits within the specified width
				const calculateMaxFontSize = () => {
				let fontSize = img.width * 0.055; // Starting font size (adjust as needed)
				while (getTextWidth(fontSize) > maxWidth && fontSize > 10) {
					fontSize--;
				}
				return fontSize;
				};
			  
				for (let n = 0; n < words.length; n++) {
				  const testLine = line + words[n] + ' ';
				  const metrics = context.measureText(testLine);
				  const testWidth = metrics.width;
			  
				  if (testWidth > maxWidth && n > 0) {
					lines.push(line.trim());
					line = words[n] + ' ';
				  } else {
					line = testLine;
				  }
				}
				lines.push(line.trim());
			  
				const lineHeight = calculateMaxFontSize(); // Adjust based on dynamically calculated font size
				const totalHeight = lines.length * lineHeight;
				const startY = y - totalHeight / 2;
			  
				lines.forEach((line, index) => {
				  context.font = `${lineHeight}px Impact`;
				  context.fillText(line, x, startY + index * lineHeight);
				});
			  };

			// Calculate the center coordinates relative to the white border
			const centerX = newWidth / 2;
			const centerY = (newHeight - img.height) / 2 + (img.height * 0.04);

			// Wrap, center, and draw the text
			wrapAndCenterText(
				ctx,
				textInput,
				centerX,
				centerY,
				newWidth - (img.width * 0.1),
				(newHeight - img.height) / 2 - (img.height * 0.04)
			  );

			// Convert canvas to data URL and set it as the result image URL
			setResultImageURL(canvas.toDataURL());
		};
		
		// Clean up the URL when the component is unmounted
		return () => {
			URL.revokeObjectURL(img.src);
		};
	}, [selectedFile, textInput]);

	return (
		<main>
			{selectedFile ? (
				<>
					<input type="text" onChange={handleTextChange} maxLength={120} />
					<canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
					{resultImageURL && <img src={resultImageURL} alt="Preview" />}
					<Link to="/create">Create new meme</Link>
				</>
			) : (
				<input type="file" onChange={handleFileChange} />
			)}
		</main>
	);
}