import { SvgType } from "../types/CommonComponents";

const SvgIcon: React.FC<SvgType> = (props) => {
  return (
    <svg className={props.className} style={props.style} onClick={props.onClick}>
      <use href={`/assets/svg/${props.iconId}`}></use>
    </svg>
  );
};

export default SvgIcon;
