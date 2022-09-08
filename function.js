//import module-module yang dibutuhkan
const validator = require('validator');
const fs = require('fs');

//direktori dan nama file kontak.
const dirPath='data';//bisa diimprove lebih lanjut
const dataPath='data/contacts.json';//bisa diimprove lebih lanjut

//periksa apakah folder 'data' sudah dibuat
if(!fs.existsSync(dirPath)){
    //jika belum, maka buat folder data
    fs.mkdirSync(dirPath);
}

//periksa apakah berkas contacts.json sudah dibuat
if(!fs.existsSync(dataPath)){
    //jika belum, maka buat file contacts.json
    fs.writeFileSync(dataPath,'[]');
}

//fungsi untuk memeriksa format nomor telepon
const validateMobile=(mobile)=>{
    if(mobile){//nomor telepon tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
        const isValidMobile = validator.isMobilePhone(mobile,'id-ID');
        if(!isValidMobile){
            console.log("wrong phone number format!");
        }
        return isValidMobile;
    }
    return mobile != undefined;
}

//fungsi untuk memeriksa format email
const validateEmail=(email)=>{
    const isValidEmail = validator.isEmail(email);
    if(email){//email tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
        if(!isValidEmail){
            console.log("wrong email format!");
        }
        return true;
    }
    return email != undefined;
}
//fungsi untuk membaca seluruh kontak yang tersimpan di file contacts.json
//penting banget! listContact sebaiknya tidak pakai parameter krn dia akan dipanggil dari luar berkas ini!
const loadContact=()=>{
    const file = fs.readFileSync(dataPath,'utf8');//baca isi file contacts
    const contacts = JSON.parse(file);//konversi dari format JSON
    return contacts;//array of js objects
}

//untuk memformat tampilan daftar kontak yang diperoleh dari listContact()
const listContact=()=>{
    const contacts = loadContact();
    console.log('Contact list: ');
    contacts.forEach((contact,i)=>{
        console.log(`${i+1}.${contact.name}-${contact.mobile}`);
    });
}

//fungsi untuk menampilkan informasi sebuah kontak
//informasi yang ditampilkan adalah nama, email, mobile
const detailContact=(name)=>{
    const contacts = loadContact();//baca seluruh kontak yang tersimpan di file contacts.json
    //find() ->find() returns the value of the first element in an array that passes a test (provided by a function)
    const contact= contacts.find(contact=>{//cari kontak yang memiliki nama tertentu
        return contact.name.toLowerCase() ===name.toLowerCase();
    })
    if(contact){//jika kontak ditemukan, maka tampilkan detail kontak tersebut
        return `${contact.name}\n${contact.email}\n${contact.mobile}`;
    }else{
        return 'Contact not found!';//jika kontak tidak ditemukan, maka tampilkan pesan kesalahan
    }
}

//function untuk save data ke dalam berkas .json
const saveToJSONFile=(name,email,mobile)=>{
    //chalenge: kalo email sama mobile nya salah, tampilkan kedua pesan error nya.
    //Selama ini kan salah satu doang.
    if(!validator.isMobilePhone(mobile,'id-ID')){//validasi nomor telepon
        console.log("wrong phone number format!");
        //rl.close();
        return;// di return supaya ketika nomor telfon nya salah, tidak dimasukkan ke contacts
    }
    if(email){//email tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
        if(!validator.isEmail(email)){//validasi email
            console.log("wrong email format!");
            //rl.close();
            return;// di return supaya ketika email nya salah, tidak dimasukkan ke contacts
        }
    }
    
    //urutan atribut pada objek json nya adalah : name, mobile, dan email
    const contact={name,mobile,email};//buat sebuah objek yang memiliki atribut name,mobile, dan email.
    const contacts = loadContact(dataPath);

    //cari apakah kontak yang dimasukkan sudah pernah dimasukkan sebelumnya
    let duplicate = contacts.find(contact=>{return contact.name===name});
    if(duplicate){
        console.log('Contact already recorded!');
        return false;
    }
    
    contacts.push(contact);//tambahkan nama,nomor telepon, dan email yang baru saja dibaca dari cmd
    fs.writeFileSync(dataPath,JSON.stringify(contacts));//tulis data yang baru ke dalam berkas .json
    console.log('Terimakasih sudah memasukkan data!');//konfirmasi data sudah berhasil ditulis ke file json
    //rl.close();
}
const getContact=(contacts,name)=>{
    //const contacts = loadContact();//baca seluruh kontak yang ada saat ini, menggunakan let karena akan mengalami perubahan

    //periksa apakah kontaknya masih kosong atau udah isi
    if(contacts.length===0){
        console.log("No contacts!");//kedepannya ini mungkin diganti jadi throw
        return false;
    }

    //cari kontak dengan nama === name
    const found = contacts.find(contact=>{//reference ke objek contact dengan [name] tertentu
        return contact.name.toLowerCase()===name.toLowerCase();
    })
    return found;
}


//function untuk menghapus kontak dengan nama tertentu
const deleteContact=(name)=>{//sebenarnya kode buat nulis ke file json bisa dipisah lagi ke kode terpisah.
    let contacts = loadContact();//baca seluruh kontak yang tersimpan di file contacts.json
    const found = getContact(contacts,name);//cari kontak yang ingin dihapus
    
    if(!found){//jika kontak yang akan dihapus tidak ditemukan
        console.log("Contact not found!");//bisa ganti jadi throw.
        return false;
    }else{//sebaliknya...
        contacts=contacts.filter(contact=>{//delete dari daftar kontak
            return contact.name.toLowerCase() !=name.toLowerCase();
        });
        fs.writeFileSync(dataPath,'[]');//kosongkan file contacts.json dengan cara menimpa isinya dengan array kosong
    }

    fs.writeFileSync(dataPath,JSON.stringify(contacts));//tulis data kontak yang baru ke dalam berkas .json
    console.log(`Contact ${name} has been deleted!`);//kirimkan pesan konfirmasi ke pengguna
}

//fungsi untuk memperbarui kontak yang sudah ada
//bisa berupa nama / email / no. telepon, atau tiga-tiganya sekaligus
const updateContact=(oldName,newName,newMobile,newEmail)=>{
    let contacts = loadContact();//baca seluruh kontak yang tersimpan di file contacts.json
    const oldContact = getContact(contacts,oldName);//cari kontak dengan nama 'oldName'

    if(!oldContact){//jika kontak yang akan dihapus tidak ditemukan
        console.log("Contact not found!");//tampilkan pesan kesalahan
        return false;
    }else{
        if(!newName && !newMobile && !newEmail){//jika pengguna tidak memasukkan nama / mobile/email baru...
            console.log('Please enter new name or new mobile or new email.');//tampilkan pesan kesalahan
            return false;
        }

        //validasi nomor telepon baru
        if(newMobile){//nomor telepon tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
            if(!validator.isMobilePhone(newMobile,'id-ID')){
                console.log("wrong phone number format!");
                return;// di return supaya ketika nomor telfon nya salah, tidak dimasukkan ke contacts
            }
        }

        //validasi email baru
        if(newEmail){//email tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
            if(!validator.isEmail(newEmail)){
                console.log("wrong email format!");
                return;// di return supaya ketika email nya salah, tidak dimasukkan ke contacts
            }
        }
        //periksa informasi mana saja yang ingin diubah.
        if(newName){//jika pengguna memasukkan nama baru, maka perbarui nama nya
            // if(newName==oldContact.name){
            //     console.log('new name is same with old name');
            //     return false;
            // }
            oldContact.name=newName;
        }

        if(newMobile){//jika pengguna memasukkan nomor mobile baru, maka perbarui nomor mobile nya
            oldContact.mobile=newMobile;
        }

        if(newEmail){//jika pengguna memasukkan nomor email baru, maka perbarui email nya
            oldContact.email=newEmail;
        }
        fs.writeFileSync(dataPath,JSON.stringify(contacts));//timpa data kontak yang lama dengan data kontak yang sudah diperbarui
        console.log(`contact ${oldName} has been updated!`);//kirimkan pesan konfirmasi ke pengguna
    }
}

//export function-function yang dibutuhkan supaya bisa dipanggil dari file lain.
exports.saveToJSONFile=saveToJSONFile;
exports.listContact=listContact;//hati-hati salah export
exports.detailContact=detailContact;
exports.deleteContact=deleteContact;
exports.updateContact=updateContact;