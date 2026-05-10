
/**
 * QR code scanner based on tutorial by Kevin (scanbot.io)
 * https://scanbot.io/techblog/javascript-qr-code-scanner-jsqr-qr-scanner-tutorial/
 * “How to build a JavaScript QR code scanner with jsQR and qr-scanner”
 * August 27, 2025
 */


import { activateTab } from "./tabs.js";

const video = document.getElementById("webcam");
const canvas = document.getElementById("qr-canvas");
const ctx = canvas.getContext("2d");

let currentQR = null;
let scanning = false;
let animationId = null;

const qrMap = {
    "PROJECT_A": "tab1",
    "PROJECT_B": "tab2",
    "PROJECT_C": "tab3"
};

// starts webcam
export async function startQRScanner() {
    scanning = true;

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    video.addEventListener("loadedmetadata", () => {
        scanLoop();
    });
}

// scan loop
function scanLoop() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const result = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
        );

        if (result) {
            const qrText = result.data;

            if (qrText !== currentQR) {
                currentQR = qrText;

                const targetTab = qrMap[qrText];

                if (targetTab) {
                    activateTab(targetTab);
                }
            }
        }
    }

    animationId = requestAnimationFrame(scanLoop);
}

export function stopQRScanner() {
    scanning = false;

    const video = document.getElementById("webcam");

    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}