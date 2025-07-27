const domain=window.location.hostname.split(".")[0];
function DomainSetUp(data){
    return "https://beesprod.beessoftware.cloud/CloudilyaAPILMS"
}

const tokenData=JSON.parse(localStorage.getItem("tokenValues"))

const config={
    api:{
        baseUrl:DomainSetUp(domain)
    },
    organization:{
        grpCode:domain,
        colCode:tokenData.ColCode?? null,
        CollegeId:tokenData.ColId??null
    }
}

export default config;              