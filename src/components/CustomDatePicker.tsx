import { forwardRef } from "react";
import { DatePicker, DatePickerProps } from "@nextui-org/react";
import { DateValue } from "@internationalized/date";

const CustomDatePicker = forwardRef<HTMLDivElement, DatePickerProps<DateValue>>(
    (props, ref) => {
        return (
            <DatePicker
                {...props}
                ref={ref}
            />
        );
    }
);

export default CustomDatePicker;
