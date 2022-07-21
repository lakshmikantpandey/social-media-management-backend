class Base64 {

    static encode(payload: any) : string {
        try {
            return Buffer.from(payload).toString('base64');
        } catch (error) {
            throw new Error("Unable to encode");
                        
        }
    }

    static decode(data: string) : any {
        try {
            return Buffer.from(data, "base64").toString("ascii");
        } catch (error) {
            throw new Error("Unable to decode");
        }
    }
}

export default Base64;