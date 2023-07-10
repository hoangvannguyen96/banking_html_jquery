let maxId = 1;
let customerId = 0;
let customer = {};

function renderCustomer(customer) {
    return `
        <tr id='id_${customer.id}'>
            <td class="text-center">${customer.id}</td>
            <td>${customer.fullName}</td>
            <td>${customer.email}</td>
            <td>${customer.address}</td>
            <td class="text-center">${customer.phone}</td>
            <td class="text-right">${customer.balance}</td>
            <td><a class="btn btn-primary edit" data-id=${customer.id}><i class="fas fa-edit"></i></a></td>
            <td><a class="btn btn-danger d-inline-block ml-0 delete" id="btnDelete" data-id=${customer.id}><i class="fas fa-trash"></i></a></td>
            <td><a class="btn btn-primary d-inline-block ml-0 deposit" data-id=${customer.id}><i class="fas fa-hand-holding-usd"></i></a></td>
            <td><a class="btn btn-success d-inline-block ml-0 transfer" data-id=${customer.id}><i class="fas fa-exchange-alt"></i></a></td>
            <td><a class="btn btn-warning d-inline-block ml-0 withdraw" data-id=${customer.id}><i class="fas fa-minus"></i></a></td>
        </tr>`;
}

function getAllCustomers() {
    const listCustomer = $("#listCustomer tbody");

    listCustomer.empty();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/customers'
    })
        .done((data) => {
            data.forEach((item) => {
                const str = renderCustomer(item);
                listCustomer.prepend(str);

                callHandleEvent();
            });
        })
        .fail((error) => {
            console.log(error)
        })
}

getAllCustomers();

function getCustomerById(id) {
    return $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/customers/' + id,
    });
}

function callHandleEvent() {

    handleAddEventShowModalUpdate();

    handleAddEventShowModalDelete();

    handleAddEventShowModalDeposit();

    handleAddEventShowModalTransfer();

    handleAddEventShowModalWithdraw();
}


// create-----------------------------------------------------------

const btnCreate = $("#btnCreate");
btnCreate.on("click", function () {
    const fullName = $("#fullnameCre").val();
    const email = $("#emailCre").val();
    const address = $("#addressCre").val();
    const phone = $("#phoneCre").val();
    const balance = 0;

    const customer = {
        fullName,
        email,
        address,
        phone,
        balance,
    };

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3000/customers',
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const listCustomer = $("#listCustomer tbody");
            listCustomer.prepend(str);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Tạo mới thành công!',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .fail((error) => {
            console.log(error)
        })
})


// update-------------------------------------------------------------

function handleAddEventShowModalUpdate() {
    let btnEdit = $(".edit");
    btnEdit.off('click');
    btnEdit.on('click', function () {
        customerId = $(this).data('id');
        getCustomerById(customerId).then((data) => {
            $("#fullnameUp").val(data.fullName);
            $("#emailUp").val(data.email);
            $("#phoneUp").val(data.phone);
            $("#addressUp").val(data.address);

            $('#modalUpdate').modal('show');
        })
            .catch((error) => {
                console.log(error)
            })
    })
}

function updateCustomer(customer) {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('id_' + customerId);
            currentRow.replaceWith(str);
            console.log(data)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cập nhật thành công!',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .fail((error) => {
            console.log(error)
        })
}

const btnUpdate = $("#btnEdit");
btnUpdate.off('click');
btnUpdate.on("click", function () {
    const fullName = $("#fullnameUp").val();
    const email = $("#emailUp").val();
    const phone = $("#phoneUp").val();
    const address = $("#addressUp").val();

    const customer = {
        fullName,
        email,
        phone,
        address,
    };

    updateCustomer(customer);
});


// deposit--------------------------------------------------------------

function handleAddEventShowModalDeposit() {
    let btnDeposit = $(".deposit");
    btnDeposit.off('click');
    btnDeposit.on("click", function () {
        customerId = $(this).data('id');
        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#fullnameDep").val(customer.fullName);
            $("#emailDep").val(customer.email);
            $("#phoneDep").val(customer.phone);
            $("#addressDep").val(customer.address);
            $("#balanceDep").val(customer.balance);

            $('#modalDeposit').modal('show');
        })
            .catch((error) => {
                console.log(error)
            })
    })
};

const btnDeposit = $("#btnDeposit");
btnDeposit.off('click');
btnDeposit.on("click", function () {
    const transactionAmount = +$("#transactionAmountDep").val();
    customer.balance = customer.balance + transactionAmount;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('#id_' + customerId);
            currentRow.replaceWith(str);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Nạp tiền thành công!',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .fail((error) => {
            console.log(error)
        })


    const depositCustomer = {
        customerId: customerId,
        fullName: $("#fullnameDep").val(),
        email: $("#emailDep").val(),
        phone: $("#phoneDep").val(),
        address: $("#addressDep").val(),
        balance: $("#transactionAmountDep").val(),
    };

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3000/depossit',
        data: JSON.stringify(depositCustomer)
    })
        .done((data) => {
            console.log(data)
        })
        .fail((error) => {
            console.log(error)
        })
});


// delete----------------------------------------------------------

function handleAddEventShowModalDelete() {
    let btnDelete = $(".delete");
    btnDelete.off('click');
    btnDelete.on("click", function () {
        customerId = $(this).data('id');

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'DELETE',
            url: 'http://localhost:3000/customers/' + customerId
        })
            .done(() => {
                $("#id_" + customerId).remove();
            })
            .fail((error) => {
                console.log(error);
            });
    });
}


// transfer--------------------------------------------------------

function handleAddEventShowModalTransfer() {
    let btnTransfer = $(".transfer");
    btnTransfer.off('click');
    btnTransfer.on("click", function () {
        customerId = $(this).data('id');

        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#idsender").val(customer.id);
            $("#namesender").val(customer.fullName);
            $("#email").val(customer.email);
            $("#phone").val(customer.phone);
            $("#address").val(customer.address);
            $("#balance").val(customer.balance);

            const customerSelect = $("#idRecipient");
            customerSelect.empty();

            $.getJSON('http://localhost:3000/customers', function (data) {
                let customers = data;

                customers.forEach((customer) => {
                    if (customer.id !== customerId) {
                        const option = $("<option></option>").val(customer.id).text(`(${customer.id}) ${customer.fullName}`);
                        customerSelect.append(option);
                    }
                });
            });

            $('#modalTransfer').modal('show');
        })
    });
};

const btnTransfer = $("#btnTransfer");
btnTransfer.on("click", function () {
    const transactionAmount = +$("#transactionAmount").val();
    customer.balance = customer.balance - transactionAmount;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('#id_' + customerId);
            currentRow.replaceWith(str);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Chuyển tiền thành công!',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .fail((error) => {
            console.log(error)
        })

    let recipientId = $('#idRecipient').val();
    let recipient;
    getCustomerById(recipientId).then((data) => {
        recipient = data;
        const transfer = +$("#transfer").val();
        recipient.balance = parseFloat(recipient.balance) + transfer;

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:3000/customers/' + recipientId,
            data: JSON.stringify(recipient)
        })
            .done((data) => {
                const str = renderCustomer(data);
                const currentRow = $('#id_' + recipientId);
                currentRow.replaceWith(str);

                const transferCustomer = {
                    customerId: customerId,
                    fullName: $("#namesender").val(),
                    email: $("#email").val(),
                    phone: $("#phone").val(),
                    address: $("#address").val(),
                    transfer: $("#transfer").val(),
                    fees: 0.1,
                    IdRecipient: recipientId,
                    NameRecipient: recipient.fullName,
                };

                $.ajax({
                    headers: {
                        'accept': 'application/json',
                        'content-type': 'application/json'
                    },
                    type: 'POST',
                    url: 'http://localhost:3000/transfer',
                    data: JSON.stringify(transferCustomer)
                })
                    .done((data) => {
                        console.log(data)
                    })
                    .fail((error) => {
                        console.log(error)
                    })
            })
            .fail((error) => {
                console.log(error)
            })
    })


});

function calculateTotal() {
    const transferAmount = parseFloat(
        document.getElementById("transfer").value
    );
    if (!isNaN(transferAmount)) {
        const transactionAmount = transferAmount + (transferAmount * 10) / 100;
        document.getElementById("transactionAmount").value = transactionAmount;
    }
}

calculateTotal();


// withdraw----------------------------------------------------------

function handleAddEventShowModalWithdraw() {
    let btnWithdraw = $(".withdraw");
    btnWithdraw.off('click');
    btnWithdraw.on("click", function () {
        customerId = $(this).data('id');
        getCustomerById(customerId).then((data) => {
            customer = data;
            $("#fullnameWit").val(customer.fullName);
            $("#emailWit").val(customer.email);
            $("#phoneWit").val(customer.phone);
            $("#addressWit").val(customer.address);
            $("#balanceWit").val(customer.balance);

            $('#modalWithdraw').modal('show');
        })
            .catch((error) => {
                console.log(error)
            })
    })
};

const btnWithdraw = $("#btnWithdraw");
btnWithdraw.off('click');
btnWithdraw.on("click", function () {
    const withdarwAmount = +$("#withdrawWit").val();
    customer.balance = customer.balance - withdarwAmount;

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/' + customerId,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = renderCustomer(data);
            const currentRow = $('#id_' + customerId);
            currentRow.replaceWith(str);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Rút tiền thành công!',
                showConfirmButton: false,
                timer: 1000
            })
        })
        .fail((error) => {
            console.log(error)
        })


    const withdrawCustomer = {
        customerId: customerId,
        fullName: $("#fullnameWit").val(),
        email: $("#emailWit").val(),
        phone: $("#phoneWit").val(),
        address: $("#addressWit").val(),
        withdrawAmount: $("#withdrawWit").val(),
    };

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: 'http://localhost:3000/withdraw',
        data: JSON.stringify(withdrawCustomer)
    })
        .done((data) => {
            console.log(data)
        })
        .fail((error) => {
            console.log(error)
        })
});
