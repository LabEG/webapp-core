export class Regexps {
    public static fio = /^[а-яёА-ЯЁa-zA-Z \-]+$/;
    public static fioOrNull = /^[а-яёА-ЯЁa-zA-Z \-]*$/;
    public static email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static phone = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
    public static fax = Regexps.phone;
    public static date = /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;

    public static bankName = /^[а-яёА-ЯЁa-zA-Z \-]+$/;
    public static checkingAccount = /^(?:[\. ]*\d){20}$/;
    public static corespAccount = /^(?:[\. ]*\d){20}$/;
    public static bik = /^[0-9]{9}$/;
    public static snils = /^(?:[- ]*\d){11}$/;
    public static ogrn = /^([0-9]{13}|[0-9]{15})$/;
    public static okpo = /^([0-9]{8}|[0-9]{10})$/;
    public static personalInn = /^([0-9]{12})$/;
    public static legalInn = /^([0-9]{10})$/;
    public static kpp = /^([0-9]{9})?$/;
    public static seriaDoc = /^[-0-9a-zA-Zа-яА-Я]{1,}$/;
    public static numberDoc = /^[\d]{1,}$/;
    public static passportDepartment = /^\d{3}-\d{3}$/;
    public static sixNumbers = /^[0-9]{6}$/;
    public static sevenNumbers = /^[0-9]{7}$/;
    public static nineNumbers = /^[0-9]{9}$/;
    public static militaryPassportSeries = /^[А-Я]{2}$/;
    public static otherPassportNumber = /^[0-9]{9}$/;
    public static passportSerial = /^\d{4}$/;
    public static onlyText = /^[а-яёА-ЯЁa-zA-Z ]+$/;
}
