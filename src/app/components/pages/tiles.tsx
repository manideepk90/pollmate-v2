import React from 'react'
import CardItem from '../dashboard/CardItem'

function Tiles() {
  return (
    <section className="w-full h-full flex flex-col items-center gap-10 justify-center">
        <div className="w-full h-full flex">
          <h1 className="text-primary text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-4 w-full">
          <CardItem
            icon={"/assets/icons/ds_user.svg"}
            title="Users"
            value="100"
            linear="2"
          />
          <CardItem
            icon={"/assets/icons/ds_poll.svg"}
            title="Polls"
            value="100"
            linear="2"
          />
          <CardItem
            icon={"/assets/icons/ds_ads.svg"}
            title="Ads"
            value="100"
            linear="3"
          />
          <CardItem
            icon={"/assets/icons/ds_report.svg"}
            title="Reports"
            value="100"
            linear="4"
          />
        </div>
      </section>
  )
}

export default Tiles;
