(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_button = document.querySelector('.connect-button');
const update_button = document.querySelector('.update_button');
const img_1 = document.querySelector('#pic1');
const img_2 = document.querySelector('#pic2');
const img_3 = document.querySelector('#pic3');
const img_4 = document.querySelector('#pic4');
const img_5 = document.querySelector('#pic5');
const inp_1 = document.querySelector('#image-upload1');
const inp_2 = document.querySelector('#image-upload2');
const inp_3 = document.querySelector('#image-upload3');
const inp_4 = document.querySelector('#image-upload4');
const inp_5 = document.querySelector('#image-upload5');
const field_1 = document.querySelector('#username1');
const field_2 = document.querySelector('#username2');
const field_3 = document.querySelector('#username3');
const field_4 = document.querySelector('#username4');
const field_5 = document.querySelector('#username5');
var owner = '';
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function showAlert(message, color) {
    var customAlert = document.querySelector('.custom-alert');
    var customAlertMessage = document.querySelector('#custom-alert-message');
    customAlertMessage.textContent = message;
    customAlert.style.backgroundColor = color == 'teal' ? 'teal' : '#550505';
    customAlert.style.display = 'block';
    setTimeout(function () {
        customAlert.style.display = 'none';
    }, 3000);
}
;
function show_invalid(field) {
    //console.log(field)
    field.classList.add('invalid');
    setTimeout(() => {
        field.classList.remove('invalid');
    }, 10000);
}
function dim() {
    // show the overlay
    var overlay = document.getElementById('overlay');
    var temp_loader = document.getElementById('temp-loader');
    var hint_text = document.getElementById('hint-text');
    overlay.style.display = 'block';
    temp_loader.style.display = 'flex';
    hint_text.style.display = 'block';
}
function undim() {
    // hide the overlay
    var overlay = document.getElementById('overlay');
    var temp_loader = document.getElementById('temp-loader');
    var hint_text = document.getElementById('hint-text');
    overlay.style.display = 'none';
    temp_loader.style.display = 'none';
    hint_text.style.display = 'none';
}
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield window.solana.connect();
        connect_button.textContent = 'Wallet connected';
        owner = window.solana.publicKey.toString();
        showAlert('Successfully connected wallet!', 'teal');
        connect_button.removeEventListener('click', connect);
    }
    catch (e) {
        showAlert('Error while connecting wallet', 'red');
        console.log(e);
    }
});
const update = () => __awaiter(void 0, void 0, void 0, function* () {
    if (owner === '') {
        showAlert('Wallet not connected!', 'red');
        return;
    }
    else if (owner != 'ANt5VC1mAVo8SrPuAc6Ls2VGkaDrehKrrM6NdomkwPq') {
        showAlert('Connected wallet does not have permission!', 'red');
        return;
    }
    else {
        console.log(owner);
        try {
            dim();
            const addresses = [field_1.value, field_2.value, field_3.value, field_4.value, field_5.value];
            const forms = [field_1, field_2, field_3, field_4, field_5];
            const imgs = [img_1, img_2, img_3, img_4, img_5];
            var valid_addresses = [];
            var valid_imgs = [];
            var proceed = true;
            for (var i = 0; i < addresses.length; i++) {
                if (addresses[i] === '') {
                    continue;
                }
                if (addresses[i] != '' && imgs[i].src.includes('base-invis.PNG')) {
                    showAlert('Some provided addresses are missing images!', 'red');
                    undim();
                    return;
                }
                var is_valid = 'worked';
                yield fetch('https://saisei-server.com//verify-teki', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        mint: addresses[i],
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                    is_valid = data;
                });
                if (is_valid === 'worked') {
                    console.log('updating this nft');
                    valid_addresses.push(addresses[i]);
                    valid_imgs.push(imgs[i]);
                }
                else {
                    console.log('updating failed');
                    showAlert('invalid Address', 'red');
                    show_invalid(forms[i]);
                    undim();
                    return;
                }
            }
            console.log(valid_addresses, '\n');
            console.log(valid_imgs, '\n');
            const hint_text = document.getElementById('hint-text');
            hint_text.innerText = `0/${valid_addresses.length} updates completed`;
            for (var i = 0; i < valid_addresses.length; i++) {
                const mint_addres = valid_addresses[i];
                const new_img = valid_imgs[i].src;
                yield fetch('https://saisei-server.com//update_image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        img: new_img,
                        mint: mint_addres,
                    })
                });
                const hint_text = document.getElementById('hint-text');
                hint_text.innerText = `${i + 1}/${valid_addresses.length} updates completed`;
                yield sleep(2000);
            }
            undim();
            showAlert('Success!', 'teal');
            hint_text.innerText = `Validating inputs`;
            for (var i = 0; i < addresses.length; i++) {
                const field = forms[i];
                const imeg = imgs[i];
                field.value = '';
                imeg.src = './assets/base-invis.PNG';
            }
        }
        catch (e) {
            console.log(e);
            //Handle the error
        }
    }
});
img_1.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_1.click();
});
inp_1.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
        // Set the src attribute of the image with the data URL
        img_1.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
img_2.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_2.click();
});
inp_2.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
        // Set the src attribute of the image with the data URL
        img_2.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
img_3.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_3.click();
});
inp_3.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
        // Set the src attribute of the image with the data URL
        img_3.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
img_4.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_4.click();
});
inp_4.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
        // Set the src attribute of the image with the data URL
        img_4.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
img_5.addEventListener("click", () => {
    // Trigger a click on the file input button to allow the user to select an image
    inp_5.click();
});
inp_5.addEventListener("change", (event) => {
    var _a;
    const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
    // Read the selected file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
        // Set the src attribute of the image with the data URL
        img_5.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
//console.log(update_button,connect_button);
//console.log(img_1,img_2,img_3,img_4,img_5);
//console.log(inp_1,inp_2,inp_3,inp_4,inp_5);
//console.log(field_1,field_2,field_5);
update_button.addEventListener('click', update);
connect_button.addEventListener('click', connect);

},{}]},{},[1]);
