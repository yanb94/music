import React from "react";
import "./BirthdateInput.scss";
import { Controller } from "react-hook-form";
import { subYears } from "date-fns";

/**
 * 
 * @param {string} currentYear 
 * @returns {string[]}
 */
function getListYear(currentYear)
{
    const finalYear = currentYear - 80;
    let result = [];

    for (let index = currentYear; index > finalYear; index--) {
        result.push(index)        
    }
    return result;
}

/**
 * 
 * @param {number} number
 */
function twoDigitNumber(number)
{
    return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

function formatDate(year, month, day)
{
    return year+"-"+twoDigitNumber(month)+"-"+twoDigitNumber(day)
}

function processDate(rawDate)
{
    const date = new Date(rawDate);
    return {
        fullDate: formatDate(
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate()
        ),
        formatYear: date.getFullYear(),
        formatMonth: twoDigitNumber(date.getMonth()+1),
        formatDay: twoDigitNumber(date.getDate())
    }
}

function extractDayFromValue(value)
{
    return (value.split('-')[2]).split('T')[0]
}

function extractMonthFromValue(value)
{
    return value.split('-')[1]
}

function extractYearFromValue(value)
{
    return value.split('-')[0]
}

export default function BirthdateInput({label, name, errors, control})
{
    const startYearRaw = subYears(new Date(), 18);
    const {fullDate: startDate, formatYear: startYear} = processDate(startYearRaw)

    const monthList = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    return <div className="birthdate-input">
        <label>{label}</label>
            <Controller
                control={control}
                name={name}
                defaultValue={startDate}
                render={ ({ field: { value, onChange }}) => {
                    
                        return <div className="birthdate-input--cont">
                            <select id="day" className="day" value={extractDayFromValue(value)} onChange={(e) => {
                                onChange(
                                    formatDate(
                                        extractYearFromValue(value),
                                        extractMonthFromValue(value),
                                        parseInt(e.target.value)
                                    )
                                )
                            }}>
                                {
                                    [...Array(31).keys()].map((v) => <option key={v} value={twoDigitNumber(v+1)} >{v+1}</option>)
                                }
                            </select>
                            <select id="month" className="month" value={extractMonthFromValue(value)} onChange={(e) => {
                                onChange(
                                    formatDate(
                                        extractYearFromValue(value),
                                        parseInt(e.target.value),
                                        extractDayFromValue(value)
                                    )
                                )
                            }}>
                                {
                                    monthList.map((v,i) => <option key={i} value={twoDigitNumber(i+1)}>{v}</option>)
                                }
                            </select>
                            <select id="year" className="year" value={extractYearFromValue(value)} onChange={(e) => {
                                onChange(
                                    formatDate(
                                        parseInt(e.target.value),
                                        extractMonthFromValue(value),
                                        extractDayFromValue(value)
                                    )
                                )
                            }}>
                                {
                                    getListYear(startYear).map((v,i) => <option key={i} value={v}>{v}</option>)
                                }
                            </select>
                        </div>
                    }
                }
            > 
            </Controller>
            {
                errors[name]?.message ? <div className="birthdate-input--error">
                    <i className="fas fa-exclamation-triangle"></i> :  {errors[name]?.message}
                </div> : ""
            }
            
    </div>
}