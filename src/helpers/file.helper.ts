import axios from "axios";

//Converts and return binary objects from their url.
async function UrlToBinary(url: string) {
    return await axios.get(url, {
        responseType: 'arraybuffer'
    }).then(response => Buffer.from(response.data, 'binary'));
}
export{
    UrlToBinary
}
