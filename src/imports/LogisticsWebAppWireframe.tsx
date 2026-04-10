function Container1() {
  return <div className="bg-[#99a1af] h-[32px] rounded-[4px] shrink-0 w-[96px]" data-name="Container" />;
}

function Container2() {
  return <div className="bg-[#99a1af] rounded-[33554400px] shrink-0 size-[40px]" data-name="Container" />;
}

function Container() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[73px] items-start left-0 pb-px pt-[16px] px-[263px] top-0 w-[974px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-b border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#4a5565] text-[12px] whitespace-pre-wrap">Wireframe Demo - User Status:</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#1e2939] h-[26px] left-0 rounded-[4px] top-0 w-[76.391px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[16px] left-[38.5px] text-[12px] text-center text-white top-[4px]">New User</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-white content-stretch flex h-[26px] items-start left-[84.39px] px-[13px] py-[5px] rounded-[4px] top-0 w-[109.5px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#364153] text-[12px] text-center">Existing Sender</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-white content-stretch flex h-[26px] items-start left-[201.89px] px-[13px] py-[5px] rounded-[4px] top-0 w-[128.031px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#364153] text-[12px] text-center">Logged-in Traveler</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white content-stretch flex h-[26px] items-start left-0 px-[13px] py-[5px] rounded-[4px] top-[34px] w-[116.563px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#364153] text-[12px] text-center">Pending Traveler</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white content-stretch flex h-[26px] items-start left-[124.56px] px-[13px] py-[5px] rounded-[4px] top-[34px] w-[125.594px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#364153] text-[12px] text-center">Approved Traveler</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[60px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[84px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Container5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[110px] items-start left-0 pb-[2px] pt-[12px] px-[263px] top-[73px] w-[974px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#99a1af] border-b-2 border-solid inset-0 pointer-events-none" />
      <Container4 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Arimo:Regular',sans-serif] font-normal leading-[30px] left-[223.92px] text-[#101828] text-[20px] text-center top-[-3px]">What do you want to do?</p>
    </div>
  );
}

function Container8() {
  return <div className="bg-[#99a1af] rounded-[4px] shrink-0 size-[48px]" data-name="Container" />;
}

function Heading1() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[27px] left-0 text-[#101828] text-[18px] top-[-2px]">Send a Parcel</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-2px] w-[285px] whitespace-pre-wrap">For individuals and businesses sending items between cities.</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-[76.5px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading1 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[76.5px] items-start left-[26px] top-[26px] w-[396px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f3f4f6] h-[128.5px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#1e2939] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container7 />
    </div>
  );
}

function Container11() {
  return <div className="bg-[#99a1af] rounded-[4px] shrink-0 size-[48px]" data-name="Container" />;
}

function Heading2() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[27px] left-0 text-[#101828] text-[18px] top-[-2px]">Deliver a Parcel</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-2px] w-[320px] whitespace-pre-wrap">For verified travelers carrying parcels on approved routes.</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] h-[76.5px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading2 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[76.5px] items-start left-[26px] top-[26px] w-[396px]" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-white h-[128.5px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container10 />
    </div>
  );
}

function Container14() {
  return <div className="bg-[#99a1af] rounded-[4px] shrink-0 size-[48px]" data-name="Container" />;
}

function Heading3() {
  return (
    <div className="h-[27px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[27px] left-0 text-[#101828] text-[18px] top-[-2px]">Receiver Payment / Confirmation</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[22.75px] left-0 text-[#4a5565] text-[14px] top-[-2px] w-[302px] whitespace-pre-wrap">If you were asked to pay for delivery or confirm receipt.</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] h-[76.5px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading3 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[16px] h-[76.5px] items-start left-[26px] top-[26px] w-[396px]" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-white h-[128.5px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#99a1af] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Container13 />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[417.5px] items-start relative shrink-0 w-full" data-name="Container">
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[48px] left-[150.8px] top-0 w-[146.391px]" data-name="Button">
      <p className="-translate-x-1/2 absolute decoration-solid font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[73px] text-[#364153] text-[16px] text-center top-[10px] underline">Track a Delivery</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex h-[16px] items-start left-0 top-[56px] w-[448px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#4a5565] text-[12px] text-center whitespace-pre-wrap">Check delivery status using delivery ID or phone number.</p>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Paragraph4 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] h-[583.5px] items-start left-[263px] top-[215px] w-[448px]" data-name="Main Content">
      <Heading />
      <Container6 />
      <Container16 />
    </div>
  );
}

function Link() {
  return (
    <div className="h-[16px] relative shrink-0 w-[68.703px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="decoration-solid font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#4a5565] text-[12px] underline">How it works</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[60.922px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="decoration-solid font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#4a5565] text-[12px] underline">Safety rules</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[42.547px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="decoration-solid font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#4a5565] text-[12px] underline">Support</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex gap-[24px] items-start justify-center pr-[0.016px] relative size-full">
          <Link />
          <Link1 />
          <Link2 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[65px] items-start left-0 pt-[25px] px-[263px] top-[862.5px] w-[974px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-solid border-t inset-0 pointer-events-none" />
      <Container17 />
    </div>
  );
}

function PY() {
  return (
    <div className="bg-[#f9fafb] h-[927.5px] relative shrink-0 w-full" data-name="pY">
      <Header />
      <Container3 />
      <MainContent />
      <Footer />
    </div>
  );
}

export default function LogisticsWebAppWireframe() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Logistics Web App Wireframe">
      <PY />
    </div>
  );
}