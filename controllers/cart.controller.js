const Cart = require('../models/Cart');
const cartController = {};

cartController.addToCart = async(req, res) => {
    try {
        const {userId} = req;
        const {lectureId, txtbk, fileTxtbk} = req.body;

        //유저가 카트를 가지고 있는지
        let cart = await Cart.findOne({userId});
        //유저가 카트가 없으면 만들어주기
        if(!cart){
            cart = new Cart({userId});
            await cart.save();
        }
        //이미 카트에 들어가 있는 아이템인지
        const existItem = cart.items.find((item) => item.lectureId.equals(lectureId) && item.txtbk === txtbk && item.fileTxtbk === fileTxtbk);
        //이미 카트에 아이템이 있다면 에러
        if(existItem){
            throw new Error('이미 장바구니에 있는 강의입니다.');
        }
        //아니라면 카트에 아이템 추가
        cart.items = [...cart.items, {lectureId, txtbk, fileTxtbk}];
        await cart.save();

        res.status(200).json({status: 'success', data: cart, cartItemQty: cart.items.length});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

module.exports = cartController;