export interface EmailTemplate {
    id?: number;
    category: string;
    name: string;
    subject: string;
    createdAt: Date;
    updatedAt: Date;
    json: {};
    html: string;
    body: string;
    css: string;
    js: string;
    fonts: string;
}
export class EmailTemplate implements EmailTemplate {}
