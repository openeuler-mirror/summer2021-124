const macInput = (formValue) => {
    if ((formValue.value.mac.length - 1) % 3 === 2 &&
        formValue.value.mac.length < 18
    ) {
        formValue.value.mac =
            formValue.value.mac.substr(
                0,
                formValue.value.mac.length - 1
            ) +
            ":" +
            formValue.value.mac.substr(
                formValue.value.mac.length - 1,
                1
            );
    } else if (formValue.value.mac.length === 18) {
        formValue.value.mac = formValue.value.mac.substr(0, 17);
    }
    if (
        formValue.value.mac.substr(
            formValue.value.mac.length - 2,
            2
        ) === "::"
    ) {
        formValue.value.mac = formValue.value.mac.substr(
            0,
            formValue.value.mac.length - 2
        );
    }
}
const checkCIValid = (description, ssh_rules) => {
    if (description == "as the host of ci") {
        ssh_rules.value.ssh_user = {
            required: true,
            message: "CI用途的机器必须设置用户名",
            trigger: "blur",
        };
        ssh_rules.value.ssh_passwd = {
            required: true,
            message: "CI用途的机器必须设置密码",
        };
        ssh_rules.value.ssh_ip = {
            required: true,
            validator: validateIpaddress_checkNull,
            trigger: ["blur"],
        };
    }
}
const getDesOptions = (formValue) => [
    {
        disabled: true,
        label: "自定义描述字段：",
        value: null,
    },
    {
        label: formValue.value.description,
        value: formValue.value.description,
    },
    {
        disabled: true,
        label: "预设描述字段：（CI用途的机器必选）",
        value: null,
    },
    {
        label: "as the host of ci",
        value: "as the host of ci",
    },
]
const validateMac = function (rule, value) {
    if (!/^(([0-9A-Fa-f]{2}):){5}([0-9A-Fa-f]{2})$/.test(value)) {
        return new Error("MAC地址不合法");
    }
};
const validateIpaddress = function (rule, value) {
    if (
        !/^(([0-9]|[0-9]{2}|[0-9]{3})\.){3}([0-9]|[0-9]{2}|[0-9]{3})$/.test(
            value
        ) &&
        value
    ) {
        return new Error("IP地址不合法");
    } else {
        return true;
    }
};
const validatePasswordSame = function (rule, value, formValue) {
    return value === formValue.value.passwd;
};
const validateBmcPasswordSame = function (rule, value, formValue) {
    if (value !== formValue.value.passwd) {
        return new Error("两次密码不一致");
    } else {
        return true;
    }
};
const validateIpaddress_checkNull = function (rule, value) {
    if (!value) {
        return new Error("IP地址不可为空");
    } else if (
        !/^(([0-9]|[0-9]{2}|[0-9]{3})\.){3}([0-9]|[0-9]{2}|[0-9]{3})$/.test(
            value
        )
    ) {
        return new Error("IP地址不合法");
    } else {
        return true;
    }
};
const handlePwdDisable = (formValue, password) => {
    if (!formValue.passwd && formValue.repasswd) {
        formValue.repasswd = "";
    }
    return (
        !formValue.passwd ||
        (formValue.passwd === password && password)
    );
}
export {
    macInput,
    checkCIValid,
    getDesOptions,
    validateIpaddress,
    validateIpaddress_checkNull,
    validatePasswordSame,
    validateMac,
    validateBmcPasswordSame,
    handlePwdDisable,
}