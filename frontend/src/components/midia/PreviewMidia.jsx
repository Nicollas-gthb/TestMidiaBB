import "./PreviewMidia.css"

export const Preview = ({ preview, file }) => {
    if(file.type.startsWith("image/")) {
        return <img src={preview} className="preview" alt={file.name} />
    }

    if(file.type.startsWith("video/")) {
        return <video src={preview} className="preview" controls />
    }
    
    return <p>Formato não suportado</p>
}