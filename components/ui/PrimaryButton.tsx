import React from "react";
import { Button } from "@radix-ui/themes";

type Props = {
  children: React.ReactNode;
  link: string;
};

const PrimaryButton = ({ children, link }: Props) => {
  return (
    <Button asChild mt="3" size="3" color="red" variant="solid">
      <a href={link}>{children}</a>
    </Button>
  );
};

export default PrimaryButton;
