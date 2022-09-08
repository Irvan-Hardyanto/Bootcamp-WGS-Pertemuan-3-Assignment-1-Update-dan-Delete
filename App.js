const yargs=require('yargs');
const {saveToJSONFile,listContact,detailContact,deleteContact,updateContact}= require('./function.js');

yargs.command({//buat command baru bernama add
    command:'add',
    describe: 'add new contact',
    builder:{//parameter dari command yang dibuat
        name:{
            describe: 'Contact Name',
            demandOption: true,//kalau true wajib diisi
            type: 'string',
        },
        email: {
            describe: 'Contact email',
            demandOption: false,//kalau false tidak wajib diisi
            type: 'string',
        },
        mobile: {
            describe: 'contact mobile phone number',
            demandOption: true,
            type:'string',
        },
    },
    handler(argv){
        const contact={
            name: argv.name,
            email: argv.email,
            mobile: argv.mobile,
        };
        //console.log(contact);
        saveToJSONFile(argv.name,argv.email,argv.mobile);
        
    },
})
yargs.command({
    command:'list',
    describe: 'see contact list',
    handler(){
        listContact();
    }
})

yargs.command({
    command:'detail',
    describe: 'see details for a name',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,//kalau true wajib diisi
            type: 'string',
        },
    },
    handler(argv){
        console.log(detailContact(argv.name));
    },
})

yargs.command({
    command: 'delete',
    describe: 'delete a contact',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv){
        deleteContact(argv.name);
    }
})

yargs.command({
    command: 'update',
    describe: 'delete a contact',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
        newName:{
            describe: 'New Contact Name',
            demandOption: false,
            type: 'string',
        },
        newMobile:{
            describe: 'Contact mobile phone',
            demandOption: false,
            type: 'string',
        },
        newEmail:{
            describe: 'Contact mobile phone',
            demandOption: false,
            type: 'string',
        }
    },
    handler(argv){
        updateContact(argv.name,argv.newName,argv.newMobile,argv.newEmail);
    }
})

yargs.parse();//Parse cukup sekali di paling akhir.