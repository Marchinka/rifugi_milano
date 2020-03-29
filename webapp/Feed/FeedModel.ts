export class FeedItem {
    _id: string;
    text: string;
    writerName: string;
    date: string;
    writerIcon: string;
}

export interface FeedModel {
    feedItems: FeedItem[];
}