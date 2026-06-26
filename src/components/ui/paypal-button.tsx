'use client'

interface PayPalButtonProps {
  buttonId: string
  price: number
}

export default function PayPalButton({ buttonId, price }: PayPalButtonProps) {
  const className = `pp-${buttonId}`
  const styleContent = `.${className}{text-align:center;border:none;border-radius:0.25rem;min-width:11.625rem;padding:0 2rem;height:2.625rem;font-weight:bold;background-color:#FFD140;color:#000000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:1rem;line-height:1.25rem;cursor:pointer;}`

  return (
    <div className="text-center">
      <style dangerouslySetInnerHTML={{ __html: styleContent }} />
      <form action={`https://www.paypal.com/ncp/payment/${buttonId}`} method="post" target="_blank" style={{display:'inline-grid',justifyItems:'center',alignContent:'start',gap:'0.5rem'}}>
        <input className={`${className} w-full`} type="submit" value={`Pay $${price}`} />
        <img src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" alt="cards" style={{height:'1rem'}} />
      </form>
    </div>
  )
}
