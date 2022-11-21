// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Regexps {

    public static fio: RegExp = /^[а-яёА-ЯЁa-zA-Z -]+$/u;

    public static fioOrNull: RegExp = /^[а-яёА-ЯЁa-zA-Z -]*$/u;

    // eslint-disable-next-line max-len
    public static email: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;

    // eslint-disable-next-line max-len
    public static phone: RegExp = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/u;

    public static fax: RegExp = Regexps.phone;

    public static date: RegExp = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/u;

    public static bankName: RegExp = /^[а-яёА-ЯЁa-zA-Z -]+$/u;

    public static checkingAccount: RegExp = /^(?:[. ]*\d){20}$/u;

    public static corespAccount: RegExp = /^(?:[. ]*\d){20}$/u;

    public static bik: RegExp = /^[0-9]{9}$/u;

    public static snils: RegExp = /^(?:[- ]*\d){11}$/u;

    public static ogrn: RegExp = /^([0-9]{13}|[0-9]{15})$/u;

    public static okpo: RegExp = /^([0-9]{8}|[0-9]{10})$/u;

    public static personalInn: RegExp = /^([0-9]{12})$/u;

    public static legalInn: RegExp = /^([0-9]{10})$/u;

    public static kpp: RegExp = /^([0-9]{9})?$/u;

    public static seriaDoc: RegExp = /^[-0-9a-zA-Zа-яА-Я]{1,}$/u;

    public static numberDoc: RegExp = /^[\d]{1,}$/u;

    public static passportDepartment: RegExp = /^\d{3}-\d{3}$/u;

    public static sixNumbers: RegExp = /^[0-9]{6}$/u;

    public static sevenNumbers: RegExp = /^[0-9]{7}$/u;

    public static nineNumbers: RegExp = /^[0-9]{9}$/u;

    public static militaryPassportSeries: RegExp = /^[А-Я]{2}$/u;

    public static otherPassportNumber: RegExp = /^[0-9]{9}$/u;

    public static passportSerial: RegExp = /^\d{4}$/u;

    public static onlyText: RegExp = /^[а-яёА-ЯЁa-zA-Z ]+$/u;

}
