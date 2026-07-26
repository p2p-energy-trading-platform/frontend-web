import { Card } from "@/components/ui/card";


export default function HowItWorksSection() {

    return (

        <section className="border border-green-500 bg-background flex flex-row justify-center gap-20">
                
            <div> 

                <div className="flex flex-row justify-center gap-6">
        
                    <Card className="w-64 p-6">

                        <div className="flex flex-col gap-3">

                            <div className="flex flex-row gap-2 items-center">

                                <img
                                    src="/images/connect_your_meter.png"
                                    alt="Connect your meter via the GridX app using your Dubai address and meter number"
                                    className="size-12 object-contain"
                                />

                                <div className="flex flex-col gap-1">

                                    <span className="text-sm text-accent font-semibold">
                                        STEP 01
                                    </span>

                                    <h3 className="text-lg font-semibold text-foreground">
                                        Connect Your Meter
                                    </h3>

                                </div>

                            </div>

                            <p className="text-text-secondary text-sm">
                                Link your smart meter via the GridX app using your Dubai address and meter number. Setup takes under three minutes.
                            </p>

                        </div>

                    </Card>


                    <Card className="w-64 p-6">

                        <div className="flex flex-col gap-3">

                            <div className="flex flex-row gap-2 items-center">

                                <img
                                    src="/images/verify_your_account.png"
                                    alt="Verify your account information in the GridX app"
                                    className="size-12 object-contain"
                                />

                                <div className="flex flex-col gap-1">

                                    <span className="text-sm text-accent font-semibold">
                                        STEP 02
                                    </span>

                                    <h3 className="text-lg font-semibold text-foreground">
                                        Verify Your Account
                                    </h3>

                                </div>

                            </div>


                            <p className="text-text-secondary text-sm">
                                Verify your account information in the GridX app to ensure everything is set up correctly.
                            </p>

                        </div>

                    </Card>


                    <Card className="w-64 p-6">

                        <div className="flex flex-col gap-3">

                            <div className="flex flex-row gap-2 items-center">

                                <img
                                    src="/images/trade_energy.png"
                                    alt="Trade energy with other users in the GridX app"
                                    className="size-12 object-contain"
                                />

                                <div className="flex flex-col gap-1">

                                    <span className="text-sm text-accent font-semibold">
                                        STEP 03
                                    </span>

                                    <h3 className="text-lg font-semibold text-foreground">
                                        Trade Energy
                                    </h3>

                                </div>

                            </div>


                            <p className="text-text-secondary text-sm">
                                Trade energy with other users in the GridX app.
                            </p>

                        </div>

                    </Card>

                </div>

            </div>            
                       
        </section>

    )    

}