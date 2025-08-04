import React from "react";

interface FooterProps {
  className?: string;
  author?: string;
}

const Footer: React.FC<FooterProps> = ({
  className = "absolute bottom-5 text-gray-600 text-sm flex justify-center w-full",
  author = "muza",
}) => {
  return (
    <footer className={className}>
      &copy; {new Date().getFullYear()} {author}
    </footer>
  );
};

export default Footer;
