// Reference Scriptfile
// Intended exclusively for auto-complete in your IDE, not for execution

declare class ScriptException extends Error {
    constructor(type: string, msg: string);
}
declare class TimeoutException extends ScriptException {
    constructor(msg: string);
}

declare class Thumbnails {
    constructor(thumbnails: Thumbnail[]);
}
declare class Thumbnail {
    constructor(url: string, quality: number) {
        this.url = url ?? ""; // string
        this.quality = quality ?? 0; // integer
    }
}

declare class PlatformID {
    constructor(platform: string, id: string, pluginId: string);
}

declare class PlatformVideoDetailsDef {
    id: PlatformID,
    name: string,
    description: string,
    video: VideoSourceDescriptor,
    thumbnails: Thumbnails,
    uploadDate: number,
    url: string,
    subtitles: Subtitle[];
}

declare class PlatformVideoDetails {
    constructor(obj: PlatformVideoDetailsDef);
}

// Sources
declare interface IVideoSourceDescriptor {}

declare interface VideoSourceDescriptorDef {
    isUnMuxed: boolean,
    videoSources: VideoSource[]
}
declare class VideoSourceDescriptor implements IVideoSourceDescriptor {
    constructor(obj: VideoSourceDescriptorDef);
}

declare interface HLSSourceDef {
    name: string,
    duration: number,
    url: string
}
declare class HLSSource implements IVideoSource {
    constructor(obj: HLSSourceDef);
}

declare interface Subtitle {
    name: string,
    url: string,
    format: string
}

// Channel
declare interface PlatformChannelDef {
    id: string,
    name: string,
    thumbnail: string,
    banner: string,
    subscribers: number,
    description: string,
    url: string,
}
declare class PlatformChannel {
    constructor(obj: PlatformChannelDef);
}

// To override by plugin
interface Source {
    enable(): void;
    getHome(): PlatformVideoDetails[];
    getChannel(url: string): PlatformChannel;
    getChannelVideos(url: string): PlatformVideoDetails[];
    isChannelUrl(url: string): boolean;
    getVideoDetails(url: string): PlatformVideoDetails;
    isVideoDetailsUrl(url: string): boolean;
}

const source: Source;