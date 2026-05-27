export const extrairIdYoutube = (url) => {
    const padrao = /(?:v=|youtu\.be\/|\/live\/|\/shorts\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(padrao)
    return match ? match[1] : null
}