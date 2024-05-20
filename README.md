# Picon Zero for Node-Red

This provides a set of nodes that allows you to interact with the Picon Zero Raspberry PI hat. 

This is based on a Python to JS port of piconzero.py from https://github.com/4tronix/PiconZero/.

# Nodes

All nodes will first check that the Initialise node has been executed. If not, they will throw a catchable error.

## Initialise

### Purpose

This must be run before any other nodes to ensure the Picon Zero is in a clean state. This can be re-run to cleanup any operations too.

### Config
No configuration required

### I/O

__Input 1__: Only exists to allow an existing flow to continue.

__Output 1__: Only exists to allow the flow to continue.

### Variables

`flow.PiconZero_Initialised`: Adds the variable with value `true` to the flow context so that you (and the other nodes) can see if the `Initailise` node has been executed.



## Read Input

### Purpose

Reads a value from a specified input channel. 

### Config

Channel: The input channel to read from (0 - 3)

### I/O

__Input 1__: (Optional) When message payload is an **Object**, `input.id` will override configuration option e.g. `msg.payload.input.id = 1`

Example payload:
```json
{
	"payload": {
		"input": {
			"id": 0
		}
	}
}
```


__Output 1__: The Message will gain the property `ReadInputValue` with the retrieved value e.g. `msg.ReadInputValue`



## Set Input Mode

### Purpose

Sets the mode of the input to one of: Digital(`0`), Analog(`1`), DS18B20(`2`), Duty Cycle(`4`), or Pulse Width(`5`)

### Config

**Input Id**: The input channel to configure from (0 - 3)

**Mode**: The mode to switch to: Digital(`0`), Analog(`1`), DS18B20(`2`), Duty Cycle(`4`), or Pulse Width(`5`)

**Pullup?**: If Digital(`0`), then should the input be pulled up(`true`) or down(`false`)

**Period**: The period value to use when retriving the value. Default: 2000


### I/O

__Input 1__: (Optional) When message payload is an **Object**, `input.id`, `input.mode`, `input.pullup` (optional), and `input.period` (optional) will override the configuration options. 

Example payload:
```json
{
	"payload": {
		"input": {
			"id": 0,
			"mode": 1,
			"period": 3000,
			"pullup": false
		}
	}
}
```

__Output 1__: Only exists to allow the flow to continue.

### Variables

`flow.PiconZero_Input{inputId}Config`: A flow variable containing the current mode of the input channel e.g. `flow.PiconZero_Input0Config`


## Set Motor

### Purpose

Sets the speed of the Motor A or Motor B

### Config

**Motor Id**: The motor to change (0 - 1)

**Value**: The speed of the output (-128 - 128)


### I/O

__Input 1__: (Optional) When message payload is an **Object**, `motor.id`, and `motor.value` will override the configuration options. 

Example payload:
```json
{
	"payload": {
		"motor": {
			"id": 0,
			"value": 120
		}
	}
}
```

__Output 1__: Only exists to allow the flow to continue.



## Set Output Mode

### Purpose

Sets the mode of the specified output to one of: On/Off(`0`), PWM(`1`), Servo(`2`), WS281B(`3`)

### Config

**Output Id**: The output to change (0 - 5)

**Mode**: The mode of the output: On/Off(`0`), PWM(`1`), Servo(`2`), WS281B(`3`)

### I/O

__Input 1__: (Optional) When message payload is an **Object**, `output.id`, and `output.mode` will override the configuration options. 

Example payload:
```json
{
	"payload": {
		"output": {
			"id": 0,
			"mode": 1
		}
	}
}
```

__Output 1__: Only exists to allow the flow to continue.

### Variables

`flow.PiconZero_Output{outputId}Mode`: A flow variable containing the current mode of the output e.g. `flow.PiconZero_Output0Mode`


## Set Output Value

### Purpose

Sets the value of the specified output. The value is based on the mode of the output:

- For On/Off, the value can be either 0 (Off), or 1 (On)
- For PWM, the value is 0 - 100 (% duty cycle)
- For Servo, the value is the position in degrees between -100 and 100
- For WS2812B, the value is formatted as: PixelID, Red, Green, Blue

### Config

**Output Id**: The output to change (0 - 5)

**Value**: The value to send to the output

### I/O

__Input 1__: (Optional) When message payload is an **Object**, `output.id`, and `output.vALUE` will override the configuration options. 

Example payload:
```json
{
	"payload": {
		"output": {
			"id": 0,
			"value": 20
		}
	}
}
```

__Output 1__: Only exists to allow the flow to continue.

## Licence

All files are Licensed under Creative Commons BY-SA See creativecommons.org/licenses/by-sa/3.0/ for details