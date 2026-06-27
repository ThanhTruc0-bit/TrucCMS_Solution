export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const IMAGE_BASE_URL =
    process.env.REACT_APP_IMAGE_BASE_URL || process.env.REACT_APP_API_URL;

export const fixImageUrl = (url) => {
    if (!url) return "";

    return url.startsWith("http")
        ? url
        : `${IMAGE_BASE_URL}${url.startsWith("/") ? url : "/" + url}`;
};