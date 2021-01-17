'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////



const displayMovements = function(movement,sorted = false){
  containerMovements.innerHTML = '';
 
  const mov = sorted 
  ? movement.slice().sort((a,b) => a-b) 
  : movement;
  
 
  mov.forEach(function(move,i){
    const type = move>0 ? 'deposit':'withdrawal'

    const html=`
     <div class="movements__row">
             <div class="movements__type movements__type--${type}">${i+1}${type}</div>
             <div class="movements__value">${move}€</div>
      </div>`; 
   
           
           containerMovements.insertAdjacentHTML("afterbegin",html)
   });
}; 



const displaySummary = function(acc){
  var sum1 = 0
  var sum2 = 0
  var sum3 = 0
  for(var i=0;i<acc.movements.length;i++){
    if(acc.movements[i]>0){
      sum1 = sum1+acc.movements[i]
      sum3 = sum3 + (acc.movements[i]*1.2)/100;
    }else{
      sum2 = sum2+acc.movements [i]
    }
  }
  acc.balance = sum1+sum2+sum3;
  console.log(acc);
  labelSumIn.textContent = `${sum1}€`;
  labelSumOut.textContent = `${Math.abs(sum2)}€`;
  labelSumInterest.textContent = `${sum3.toFixed(2)}€`;
  labelBalance.textContent = `${acc.balance}€`

} 



accounts.forEach(function(acc){
  const createUsername = acc.owner.split(' ')
  .map(function(cor){
    return cor[0]
  })
  .join('')
  .toLowerCase()
  acc.username = createUsername
}); 



let currentAccount;
btnLogin.addEventListener('click',function(e){
  
  e.preventDefault();
  currentAccount='';
  for(var acc of accounts){
     if(acc.username ===  inputLoginUsername.value)
     {
       currentAccount = acc;
     }
  }
  console.log(currentAccount);


if(currentAccount?.pin === Number(inputLoginPin.value)){
  labelWelcome.textContent = `Welcome
  ${currentAccount.owner.split(' ')[0] 
}`;
containerApp.style.opacity = 100;

displayMovements(currentAccount.movements)
displaySummary(currentAccount)
inputLoginUsername.value = '';
inputLoginPin.value= '';
}
else(alert('Password Error'))
});  






let receiverAccount;
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  receiverAccount='';
  for(var acc of accounts){
    if(acc.username === inputTransferTo.value)
    {
     receiverAccount = acc;
    }
  }
  console.log(receiverAccount);
  var amt = Number(inputTransferAmount.value);

  if(amt > 0 && 
    receiverAccount && 
    receiverAccount?.username !== currentAccount.username
    && currentAccount.balance>=amt)
    {
    currentAccount.movements.push(-amt);
    receiverAccount.movements.push(amt);


   
    displayMovements(currentAccount.movements);
    displaySummary(currentAccount);
    inputTransferTo.value = '';
    inputTransferAmount.value= '';
    }
    else{
      alert('invalid Transaction. Please Check!')
      inputTransferTo.value = '';
    inputTransferAmount.value= '';
    }
});


btnClose.addEventListener('click',function(e){
  e.preventDefault();
  var ind;
  if(inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin)
    {
    accounts.forEach(function(acc,i){
      if(acc.username === currentAccount.username){
        ind = i;
      }
    })
    accounts.splice(ind,1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = '';
    inputClosePin.value = '';

    }else{
      alert('invalid account!')
      inputCloseUsername.value = '';
      inputClosePin.value = '';
    }
});

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amt = Number(inputLoanAmount.value);
   let maxi = currentAccount.movements[0];
    for(var i=1; i<currentAccount.movements.length; i++)
    {
      if(currentAccount.movements[i]>maxi){
        maxi = currentAccount.movements[i];
      }
    }
    if(amt*0.1 <= maxi){
      currentAccount.movements.push(amt);

      displayMovements(currentAccount.movements)
      displaySummary(currentAccount)
     
     

    }
    inputLoanAmount.value = '';   
});

let sorted = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements,sorted);
})



