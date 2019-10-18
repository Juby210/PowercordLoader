//META{"name":"PowercordLoader"}*//

const { existsSync } = require("fs");
const { findModuleByProps: f, showToast } = BdApi;

class PowercordLoader {
	getName() { return "Powercord Loader" }
	getDescription() { return "Load powercord as BetterDiscord plugin" }
	getVersion() { return "1.0.0" }
	getAuthor() { return "Juby210" }

    async start() {
        const timeout = this.loadData("timeout") || 0
        await new Promise(r => { setTimeout(r, timeout) }) 

        const pcsrc = this.loadData("pcsrc")
        if(!pcsrc || (pcsrc && !existsSync(pcsrc)))
            return showToast("Powercord not loaded, src not found")

        require("module").Module.globalPaths.push(pcsrc + "/fake_node_modules")
        try {
            window.powercord = new (require(pcsrc + "/Powercord"))()
            showToast("Powercord loaded! Enjoy")
        } catch(e) {
            console.error(e)
            if(e.message && e.message.startsWith("Cannot find module"))
                showToast('Oops! Error while loading powercord, looks like you didn\'t do "npm i"')
            else showToast("Oops! Error while loading powercord, check console for details")
        }
    }
    stop() {
        if(window.powercord) window.powercord.shutdown()
        const pcsrc = this.loadData("pcsrc")
        if(pcsrc) {
            const array = require("module").Module.globalPaths
            const index = array.indexOf(pcsrc + "/fake_node_modules")
            if (index != -1) array.splice(index, 1)
        }
    }

    getSettingsPanel() {
        const timeout = this.loadData("timeout") || 0
        const pcsrc = this.loadData("pcsrc") || ""

        const inp = f("input")
        const btn = f("button")

        setTimeout(() => {
            const s = $("#pcloader-settings")
            if(s.length == 0) return;
            $(s).find("#pcl-s").click(e => {
                this.saveData("pcsrc", $(s).find("#pcl-pcsrc").val())
                this.saveData("timeout", Number($(s).find("#pcl-timeout").val()))

                e.target.innerText = "Saved!"
                setTimeout(() => { e.target.innerText = "Save" }, 1000)
            })
            $(s).find("#pcl-r").click(() => {
                showToast("Reloading..")
                this.stop()
                this.start()
            })
        }, 5)

        return `<div id="pcloader-settings"><input type="text" id="pcl-pcsrc" class="${inp.inputDefault}" value="${pcsrc}" placeholder="Powercord Source">
<input type="number" id="pcl-timeout" class="${inp.inputDefault}" value="${timeout}" placeholder="Timeout" style="margin: 10px 0" min="0">
<button id="pcl-s" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}"><div class="contents-18-Yxp">Save</div></button>
<button id="pcl-r" class="${btn.button} ${btn.sizeMin} ${btn.grow} ${btn.lookFilled} ${btn.colorBrand}"><div class="contents-18-Yxp">Reload</div></button></div>`
    }

    loadData(s) {
        return BdApi.loadData("z_powercord", s)
    }
    saveData(s, v) {
        return BdApi.saveData("z_powercord", s, v)
    }
}