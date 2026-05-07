/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 * Also http://anmar.eu.org/projects/jssha2/
   */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
   */
export class SHA256 {
    private constructor() { }
    private static _sha256: SHA256
    public static get sha256() {
        if (!SHA256._sha256)
            SHA256._sha256 = new SHA256()
        return SHA256._sha256
    }
    private hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase      */
    private b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance    */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
       */
    public hex_sha256(s) { return this.rstr2hex(this.rstr_sha256(this.str2rstr_utf8(s))); }
    private b64_sha256(s) { return this.rstr2b64(this.rstr_sha256(this.str2rstr_utf8(s))); }
    private any_sha256(s, e) { return this.rstr2any(this.rstr_sha256(this.str2rstr_utf8(s)), e); }
    private hex_hmac_sha256(k, d) { return this.rstr2hex(this.rstr_hmac_sha256(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
    private b64_hmac_sha256(k, d) { return this.rstr2b64(this.rstr_hmac_sha256(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); }
    private any_hmac_sha256(k, d, e) { return this.rstr2any(this.rstr_hmac_sha256(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); }

    /*
     * Perform a simple self-test to see if the VM is working
       */
    private sha256_vm_test() {
        return this.hex_sha256("abc").toLowerCase() == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
    }

    /*
     * Calculate the sha256 of a raw string
       */
    private rstr_sha256(s) {
        return this.binb2rstr(this.binb_sha256(this.rstr2binb(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-sha256 of a key and some data (raw strings)
       */
    private rstr_hmac_sha256(key, data) {
        var bkey = this.rstr2binb(key);
        if (bkey.length > 16) bkey = this.binb_sha256(bkey, key.length * 8);

        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.binb_sha256(ipad.concat(this.rstr2binb(data)), 512 + data.length * 8);
        return this.binb2rstr(this.binb_sha256(opad.concat(hash), 512 + 256));
    }

    /*
     * Convert a raw string to a hex string
       */
    private rstr2hex(input) {
        try { this.hexcase } catch (e) { this.hexcase = 0; }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
     * Convert a raw string to a base-64 string
       */
    private rstr2b64(input) {
        try { this.b64pad } catch (e) { this.b64pad = ''; }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8) output += this.b64pad;
                else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    }

    /*
     * Convert a raw string to an arbitrary string encoding
       */
    private rstr2any(input, encoding) {
        var divisor = encoding.length;
        var remainders = Array();
        var i, q, x, quotient;

        /* Convert to an array of 16-bit big-endian values, forming the dividend   */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }

        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. We stop when the dividend is zero.
         * All remainders are stored for later use.
           */
        while (dividend.length > 0) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[remainders.length] = x;
            dividend = quotient;
        }

        /* Convert the remainders to the output string   */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);

        /* Append leading zero equivalents   */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)))
        for (i = output.length; i < full_length; i++)
            output = encoding[0] + output;

        return output;
    }

    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
       */
    private str2rstr_utf8(input) {
        var output = "";
        var i = -1;
        var x, y;

        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs   */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }

            /* Encode output as utf-8   */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                    0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                    0x80 | ((x >>> 6) & 0x3F),
                    0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                    0x80 | ((x >>> 12) & 0x3F),
                    0x80 | ((x >>> 6) & 0x3F),
                    0x80 | (x & 0x3F));
        }
        return output;
    }

    /*
     * Encode a string as utf-16
       */
    private str2rstr_utf16le(input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
                (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    }

    private str2rstr_utf16be(input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                input.charCodeAt(i) & 0xFF);
        return output;
    }

    /*
     * Convert a raw string to an array of big-endian words
     * Characters >255 have their high-byte silently ignored.
       */
    private rstr2binb(input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
        return output;
    }

    /*
     * Convert an array of big-endian words to a string
       */
    private binb2rstr(input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
        return output;
    }

    /*
     * Main sha256 private, with its support functions
       */
    private sha256_S(X, n) { return (X >>> n) | (X << (32 - n)); }
    private sha256_R(X, n) { return (X >>> n); }
    private sha256_Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    private sha256_Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    private sha256_Sigma0256(x) { return (this.sha256_S(x, 2) ^ this.sha256_S(x, 13) ^ this.sha256_S(x, 22)); }
    private sha256_Sigma1256(x) { return (this.sha256_S(x, 6) ^ this.sha256_S(x, 11) ^ this.sha256_S(x, 25)); }
    private sha256_Gamma0256(x) { return (this.sha256_S(x, 7) ^ this.sha256_S(x, 18) ^ this.sha256_R(x, 3)); }
    private sha256_Gamma1256(x) { return (this.sha256_S(x, 17) ^ this.sha256_S(x, 19) ^ this.sha256_R(x, 10)); }
    private sha256_Sigma0512(x) { return (this.sha256_S(x, 28) ^ this.sha256_S(x, 34) ^ this.sha256_S(x, 39)); }
    private sha256_Sigma1512(x) { return (this.sha256_S(x, 14) ^ this.sha256_S(x, 18) ^ this.sha256_S(x, 41)); }
    private sha256_Gamma0512(x) { return (this.sha256_S(x, 1) ^ this.sha256_S(x, 8) ^ this.sha256_R(x, 7)); }
    private sha256_Gamma1512(x) { return (this.sha256_S(x, 19) ^ this.sha256_S(x, 61) ^ this.sha256_R(x, 6)); }
    private sha256_K = [
        1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
        -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
        1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
        264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
        -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
        113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
        1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
        -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
        1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
        -1866530822, -1538233109, -1090935817, -965641998
    ];

    private binb_sha256(m, l) {
        var HASH = new Array(1779033703, -1150833019, 1013904242, -1521486534,
            1359893119, -1694144372, 528734635, 1541459225);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h;
        var i, j, T1, T2;

        /* append padding   */
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];

            for (j = 0; j < 64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = this.safe_add(this.safe_add(this.safe_add(this.sha256_Gamma1256(W[j - 2]), W[j - 7]), this.sha256_Gamma0256(W[j - 15])), W[j - 16]);

                T1 = this.safe_add(this.safe_add(this.safe_add(this.safe_add(h, this.sha256_Sigma1256(e)), this.sha256_Ch(e, f, g)), this.sha256_K[j]), W[j]);
                T2 = this.safe_add(this.sha256_Sigma0256(a), this.sha256_Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = this.safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = this.safe_add(T1, T2);
            }

            HASH[0] = this.safe_add(a, HASH[0]);
            HASH[1] = this.safe_add(b, HASH[1]);
            HASH[2] = this.safe_add(c, HASH[2]);
            HASH[3] = this.safe_add(d, HASH[3]);
            HASH[4] = this.safe_add(e, HASH[4]);
            HASH[5] = this.safe_add(f, HASH[5]);
            HASH[6] = this.safe_add(g, HASH[6]);
            HASH[7] = this.safe_add(h, HASH[7]);
        }
        return HASH;
    }

    private safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
}