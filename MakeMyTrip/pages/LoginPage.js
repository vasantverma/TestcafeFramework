import {Selector,t} from 'testcafe'

class LoginPage
{
    //Page locators
    constructor()
    {
        this.loginPrompt=Selector('p').withExactText('Login or Create Account')

        this.loginPromptHeader=Selector('span').withExactText('Login/Signup')
        this.usernameInput=Selector('#username')
        this.passwordInput=Selector('#password')
        this.continueInput=Selector('button[data-cy="continueBtn"]')
        this.loginBtn=Selector('button[data-cy="login"]')
        this.infoPopup=Selector('div.autopop__wrap')

        this.loggedInUsername=Selector('p[data-cy="loggedInUser"]')
    }
    
    //Page methods

    async userLogin(userName,userPassword)
    {
        await t.typeText(this.usernameInput,userName,{paste:true,replace:true})
        await t.click(this.continueInput)
        await t.typeText(this.passwordInput,userPassword,{paste:true,replace:true})
        await t.click(this.loginBtn)
    }

    async openLoginPrompt()
    {
        if(this.infoPopup.visible)
        {
            await t.doubleClick(this.loginPrompt)
        }
        else
        {
            await t.click(this.loginPrompt)
        }
        
    }
}
export default LoginPage