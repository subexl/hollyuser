export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    badge?: string;
    badgeClass?: string;
    isExternalLink: boolean;
    submenu : RouteInfo[];
}


export interface NetopiaRequest{
    url: string;
    env_key: string;
    data: string;
}
