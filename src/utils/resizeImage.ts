export function readFileAsync(file: File | any) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}
export function loadImgAsync(imgSrc: any) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
        img.src = imgSrc;
    })
}
export function createCanvas(img: any, maxSize: number) {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
        if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        }

    } else {
        if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
        }
    }
    canvas.width = width;
    canvas.height = height;
    return canvas
}
export function imgToBlobAsync(img: any, canvas: HTMLCanvasElement) {
    return new Promise((resolve, reject) => {

        let maxImg = img.width > img.height ? img.height : img.width
        let maxCanvas = canvas.width > canvas.height ? canvas.height : canvas.width
        let x = 0
        let y = 0

        let width = img.width;
        let height = img.height;

        if (width > height) {
            x = (width - height) / 2
        } else {
            y = (height - width) / 2
        }

        canvas.width = maxCanvas;
        canvas.height = maxCanvas;

        const ctxMain = canvas.getContext('2d');
        ctxMain?.drawImage(img, x, y, maxImg, maxImg, 0, 0, maxCanvas, maxCanvas);
        ctxMain?.canvas.toBlob(async (blob) => {
            resolve(blob)
        }, 'image/webp');
    })
}
