using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Validations
{
    public class DateRangeAttribute : ValidationAttribute
    {
        private readonly string _startDatePropertyName;

        public DateRangeAttribute(string startDatePropertyName)
        {
            _startDatePropertyName = startDatePropertyName;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var startDateProperty = validationContext.ObjectType.GetProperty(_startDatePropertyName);

            if (startDateProperty == null)
                throw new ArgumentException("Property with this name not found");

            var startDateValue = startDateProperty.GetValue(validationContext.ObjectInstance, null);

            if (value == null || startDateValue == null)
                return ValidationResult.Success;

            if ((DateTime)value >= (DateTime)startDateValue)
            {
                if ((DateTime)startDateValue > DateTime.Now.Date)
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult("The date must be greater than today.");
                }
            }

            return new ValidationResult("DateTo must be greater than DateFrom.");
        }
    }
}
