/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
export const baseURL = "http://192.168.12.38:8086"; //http://192.168.12.38:8086
var dateFormat = (function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone =
      /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    if (!date) {
      return "--";
    }
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (
      arguments.length == 1 &&
      Object.prototype.toString.call(date) == "[object String]" &&
      !/\d/.test(date)
    ) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date();
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d: d,
        dd: pad(d),
        ddd: dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m: m + 1,
        mm: pad(m + 1),
        mmm: dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy: String(y).slice(2),
        yyyy: y,
        h: H % 12 || 12,
        hh: pad(H % 12 || 12),
        H: H,
        HH: pad(H),
        M: M,
        MM: pad(M),
        s: s,
        ss: pad(s),
        l: pad(L, 3),
        L: pad(L > 99 ? Math.round(L / 10) : L),
        t: H < 12 ? "a" : "p",
        tt: H < 12 ? "am" : "pm",
        T: H < 12 ? "A" : "P",
        TT: H < 12 ? "AM" : "PM",
        Z: utc
          ? "UTC"
          : (String(date).match(timezone) || [""])
              .pop()
              .replace(timezoneClip, ""),
        o:
          (o > 0 ? "-" : "+") +
          pad(Math.floor(Math.abs(o) / 60) * 100 + (Math.abs(o) % 60), 4),
        S: ["th", "st", "nd", "rd"][
          d % 10 > 3 ? 0 : (((d % 100) - (d % 10) != 10) * d) % 10
        ],
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
})();

// Some common format strings
dateFormat.masks = {
  default: "ddd mmm dd yyyy HH:MM:ss",
  shortDate: "m/d/yy",
  mediumDate: "mmm d, yyyy",
  longDate: "mmmm d, yyyy",
  fullDate: "dddd, mmmm d, yyyy",
  shortTime: "h:MM TT",
  mediumTime: "h:MM:ss TT",
  longTime: "h:MM:ss TT Z",
  isoDate: "yyyy-mm-dd",
  isoTime: "HH:MM:ss",
  isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  monthNames: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};

const luhnCheck = (num) => {
  const arr = (num + "")
    .split("")
    .reverse()
    .map((x) => parseInt(x));
  const lastDigit = arr.shift();
  let sum = arr.reduce(
    (acc, val, i) =>
      i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val),
    0
  );
  sum += lastDigit;
  return sum % 10 === 0;
};

const posSNCheck = (sn: string) => {
  return /^[0-9-]*$/.test(sn) && sn.length === 11;
};
const simSNCheck = (sn: string) => {
  return /^[\w]+$/.test(sn) && sn.length <= 18;
};
function checkPasswordStrength(password: string) {
  // Check password length
  if (password.length < 8) {
    return "كلمة السر يجب ان تكون أطول";
  }

  // Check for mixed case
  if (!(password.match(/[a-z]/) && password.match(/[A-Z]/))) {
    return "استخدم أحرف كبيرة و صغيرة";
  }

  // Check for numbers
  if (!password.match(/\d/)) {
    return "يجب ان تحوي كلمة السر على أرقام";
  }
  // Check for special characters
  if (!password.match(/[^a-zA-Z\d]/)) {
    return "يجب أن تحوي كلمة السر على رموز خاصة";
  }
  return undefined;
}

const bankCodes = [
  {
    name: "مصرف الجمهورية",
    code: "JBAN",
  },
  {
    name: "المصرف التجاري",
    code: "NC_Bank",
  },
  {
    name: "مصرف الوحدة",
    code: "WHAD",
  },
  {
    name: "مصرف شمال افريقبا",
    code: "NAB",
  },
  {
    name: "مصرف الصحاري",
    code: "SAHA",
  },
  {
    name: "مصرف النوران",
    code: "NUR",
  },
  {
    name: "مصرف الواحة",
    code: "WAHA",
  },
  {
    name: "مصرف الليبي الاسلامي",
    code: "LIB",
  },
  {
    name: "مصرف الخليج الأول",
    code: "FIRST_GULF",
  },
  {
    name: "مصرف المتحد",
    code: "UBCI",
  },
  {
    name: "مصرف الأندلس",
    code: "ALANDALOS",
  },
  // {
  //   name: "مصرف الجمهورية",
  //   code: "COMMERCE_DEVELOPMENT",
  // },
  {
    name: "مصرف الاجماع العربي",
    code: "ALEJMAA",
  },
  {
    name: "مصرف الصرافة",
    code: "ALSARAI",
  },
  {
    name: "مصرف الوفاء",
    code: "ALWAFA",
  },
  {
    name: "مصرف الأمان",
    code: "AMAN",
  },
  {
    name: "مصرف اليقين",
    code: "YQN",
  },
  {
    name: "مصرف ليبيا المركزي",
    code: "CBL",
  },
  {
    name: "مصرف التضامن",
    code: "ALTADHAMUN",
  },
];
export {
  dateFormat,
  luhnCheck,
  posSNCheck,
  simSNCheck,
  checkPasswordStrength,
  bankCodes,
};
