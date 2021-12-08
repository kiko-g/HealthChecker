import * as React from "react"
import Hero from "../components/Hero"
import HeroImage from "../components/HeroImage"
import Search from "../components/Search"

export default function Homepage() {
  return (
    <div className="homepage min-h-screen bg-gradient-to-br from-bluegray-400 to-bluegray-300 dark:bg-bluegray-700 font-inter">
      <div className="mx-auto grid grid-cols-12">
        <div className="col-span-12 2xl:col-span-5">
          <HeroImage />
        </div>
        <div className="col-span-12 2xl:col-span-7">
          <Hero propClassName="py-8 px-12" />
        </div>
        <div className="col-span-12">
          <Search />
        </div>
      </div>
    </div>
  )
}
