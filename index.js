console.log("Script loaded!");

let searchForm = document.querySelector('.search-box');
let formInput = document.getElementById('input-value');
let imageContainerText = document.getElementById('imageContainerText');
let imageGenerated = document.getElementById('generated-image');
let imageContainer = document.getElementById('images-visible');

async function fetchImagesFromBackend(prompt) {
    console.log("Fetching images for prompt:", prompt);
    try {
        let response = await fetch('http://localhost:4000/api/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                model: 'dall-e-2',
            }),
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Unable to fetch the data');
        }
        let data = await response.json();
        console.log('Response data:', data);

        if (data && data.imageUrl) {
            let imageUrl = data.imageUrl;
            document.getElementById('imageContainerText').innerText = "Below is your generated Image:";
            document.getElementById('images-visible').style.display = "block";
            document.getElementById('generated-image').src = imageUrl;
            console.log('Image URL:', imageUrl);

            // Call this function after generating the image
            updateDownloadLink();
        } else {
            console.error('Invalid response structure:', data);
            throw new Error('No valid images found in the response');
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let enteredText = formInput.value;
    console.log("Form submitted with text:", enteredText);
    if (enteredText !== "") {
        fetchImagesFromBackend(enteredText);
    }
});

const generatedImage = document.getElementById('generated-image');
const downloadButton = document.getElementById('download-image-btn');

// Update the download button link when the image is generated
function updateDownloadLink() {
    const imageSrc = generatedImage.src;
    if (imageSrc) {
        downloadButton.href = imageSrc; // Set the image source as the download link
        downloadButton.style.display = 'inline-block'; // Make the button visible
    } else {
        downloadButton.style.display = 'none'; // Hide the button if no image is present
    }
}