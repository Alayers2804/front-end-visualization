import JSZip from "jszip";
import pkg from "file-saver";
const { saveAs } = pkg;

export async function downloadImagesAsZip(images: Record<string, string>) {
    const zip = new JSZip();

    Object.entries(images).forEach(([filename, base64Data]) => {
        const isDataUrl = base64Data.startsWith("data:");
        const base64Content = isDataUrl ? base64Data.split(",")[1] : base64Data;

        zip.file(`${filename}.png`, base64Content, { base64: true });
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "hasil_prediksi.zip");
}
