import machine
 
class LDR:
    def __init__(self, pin):
        self.ldr_pin = machine.Pin(13)
        
    def get_value(self):
        return self.ldr_pin.value()
 
    def off(self):
        self.ldr_pin.off()
    
    def on(self):
        self.ldr_pin.on()