using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

public class PasswordValidationAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return new ValidationResult("Password is required.");
        }

        var password = value.ToString();

        if (password.Length < 8)
        {
            return new ValidationResult("Password must be at least 8 characters long.");
        }

        if (!Regex.IsMatch(password, @"[A-Za-z]"))
        {
            return new ValidationResult("Password must contain at least one letter.");
        }

        if (!Regex.IsMatch(password, @"[0-9]"))
        {
            return new ValidationResult("Password must contain at least one number.");
        }

        if (!Regex.IsMatch(password, @"[!@#$%^&*(),.?""{}|<>]"))
        {
            return new ValidationResult("Password must contain at least one special character.");
        }

        return ValidationResult.Success;
    }
}

public class EmailValidationAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return new ValidationResult("Email is Required.");
        }

        var email = value.ToString();





        var emailPattern = @"^[a-z][a-z0-9]*(\.[a-z0-9]+)*@gmail\.com$";

        if (!Regex.IsMatch(email, emailPattern))
        {
            return new ValidationResult("wrong email.");
        }

        return ValidationResult.Success;
    }
}

