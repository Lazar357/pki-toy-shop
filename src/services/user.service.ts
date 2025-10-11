import { UserModel } from "../models/user.model";


export class UserService {

    static getUsers(): UserModel[] {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'Lazar',
                    lastName: 'Danic',
                    email: 'lazard@gmail.com',
                    phone: '+38166262626    ',
                    password: 'lazar123',
                    favoriteToyType: 'Slagalica'
                }
            ]))
        return JSON.parse(localStorage.getItem('users')!)
    }


    static findUserByEmail(email: string) {
        const users: UserModel[] = this.getUsers()
        const exactUser = users.find(u => u.email === email)

        if (!exactUser) throw new Error('USER_NOT_FOUND')

        return exactUser
    }

    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)
        if (user.password !== password) throw new Error('BAD_PASSWORD')

        localStorage.setItem('active', user.email)
    }

    static signup(data: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(data)
        localStorage.setItem('users', JSON.stringify(users))
    }

    static getActiveUser() {
        const active = localStorage.getItem('active')
        if (!active) throw new Error('NO_ACTIVE_USER')

        return this.findUserByEmail(active)
    }

    

    static logout() {
        localStorage.removeItem('active')
    }
}