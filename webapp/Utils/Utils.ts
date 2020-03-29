import Constants, { Theme } from "./Constants";

export default {
    timeoutId: null,

    urlCombine(...fragements: string[]) {
        let safeFragements = [] as string[];
        fragements.forEach(fragement => {
            let newFragement = fragement;
            if(!newFragement) {
                return "";
            }
            if (newFragement.charAt(0) == "/") {
                newFragement = newFragement.substr(1)
            }
            if (newFragement.charAt(newFragement.length -1) == "/") {
                newFragement = newFragement.substr(0, newFragement.length -1);
            }
            safeFragements.push(newFragement);
        });
        let url = safeFragements.join("/");
        return url;
    },

    clone<T>(obj: T) {
        return JSON.parse(JSON.stringify(obj)) as T;
    },

    throttle(callback: () => void, id: string = "throttle_id", milliseconds: number = 250) {
        if (!this.timeouts) {
            this.timeouts = {};
        }

        clearTimeout(this.timeouts[id]);
        let timeoutId = setTimeout(() => {
            callback();
            clearTimeout(this.timeouts[id]);
        }, milliseconds);
        this.timeouts[id] = timeoutId;
    },

    getTheme() {
        let theme = localStorage.getItem("app-theme") || "";
        if (!theme) {
            localStorage.setItem("app-theme", Constants.blackTheme);
        }

        if (theme.toLowerCase() === Constants.greyTheme) {
            return Theme.Grey;
        } else {
            return Theme.Black; 
        }
    },

    switchTheme() {
        let theme = this.getTheme();
        switch (theme) {
            case Theme.Black:
                localStorage.setItem("app-theme", Constants.greyTheme);
                break;
            case Theme.Grey:
                localStorage.setItem("app-theme", Constants.blackTheme);
                break;
        }
    },

    shoIf(bool: boolean) {
        if (bool) {
            return {};
        } else {
            return {"display": "none"}
        }
    }
}