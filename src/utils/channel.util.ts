const ENV = process.env;

type ChannelOptions = {
	[key: string]: string;
}

const channelSvg: ChannelOptions = {
	Fb : `${process.env.IMAGE_URL}icons/fb.svg`,
	Ln : `${process.env.IMAGE_URL}icons/ln.svg`,
	In : `${process.env.IMAGE_URL}icons/in.svg`,
	Tw : `${process.env.IMAGE_URL}icons/tw.svg`,
}

export default channelSvg;